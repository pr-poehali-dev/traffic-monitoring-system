"""
Распознавание номерных знаков автомобилей по URL видеопотока или изображения.
Скачивает кадр с камеры и отправляет в PlateRecognizer API.
"""
import json
import os
import requests


def handler(event: dict, context) -> dict:
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    if event.get("httpMethod") != "POST":
        return {"statusCode": 405, "headers": headers, "body": json.dumps({"error": "Method not allowed"})}

    try:
        body = json.loads(event.get("body") or "{}")
        camera_url = body.get("url", "").strip()

        if not camera_url:
            return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "URL не указан"})}

        token = os.environ.get("PLATE_RECOGNIZER_TOKEN", "")
        if not token:
            return {"statusCode": 500, "headers": headers, "body": json.dumps({"error": "API токен не настроен"})}

        # Скачиваем кадр с камеры
        cam_response = requests.get(
            camera_url,
            timeout=10,
            headers={"User-Agent": "Mozilla/5.0"},
            stream=True
        )
        cam_response.raise_for_status()

        content_type = cam_response.headers.get("Content-Type", "")

        # Если это видео — берём первые байты как изображение (превью)
        # PlateRecognizer принимает jpeg/png/бинарные данные
        image_data = cam_response.content[:2_000_000]  # max 2MB

        # Отправляем в PlateRecognizer
        pr_response = requests.post(
            "https://api.platerecognizer.com/v1/plate-reader/",
            files={"upload": ("frame.jpg", image_data, "image/jpeg")},
            data={"regions": ["ru"]},
            headers={"Authorization": f"Token {token}"},
            timeout=15,
        )

        if pr_response.status_code == 402:
            return {"statusCode": 402, "headers": headers, "body": json.dumps({"error": "Лимит запросов PlateRecognizer исчерпан"})}

        pr_data = pr_response.json()

        results = []
        for result in pr_data.get("results", []):
            plate = result.get("plate", "").upper()
            confidence = round(result.get("score", 0) * 100, 1)
            vehicle = result.get("vehicle", {})
            region = result.get("region", {}).get("code", "").upper()

            results.append({
                "plate": plate,
                "confidence": confidence,
                "vehicle_type": vehicle.get("type", ""),
                "region": region,
                "box": result.get("box", {}),
            })

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps({
                "success": True,
                "results": results,
                "count": len(results),
                "processing_time": pr_data.get("processing_time", 0),
            }),
        }

    except requests.exceptions.Timeout:
        return {"statusCode": 408, "headers": headers, "body": json.dumps({"error": "Камера не отвечает (таймаут)"})}
    except requests.exceptions.ConnectionError:
        return {"statusCode": 502, "headers": headers, "body": json.dumps({"error": "Не удалось подключиться к камере"})}
    except Exception as e:
        return {"statusCode": 500, "headers": headers, "body": json.dumps({"error": str(e)})}
