export interface Camera {
  id: number;
  name: string;
  location: string;
  status: "online" | "offline" | "alert";
  url: string;
  fps: number;
  detections: Detection[];
}

export interface Detection {
  id: string;
  plate: string;
  speed: number;
  time: string;
  brand: string;
  color: string;
  confidence: number;
}

export const CAMERAS: Camera[] = [
  { id: 1, name: "КАМ-001", location: "Въезд главный", status: "online", url: "https://maps.garant-service.tv/", fps: 25, detections: [] },
  { id: 2, name: "КАМ-002", location: "Выезд северный", status: "online", url: "https://maps.garant-service.tv/", fps: 25, detections: [] },
  { id: 3, name: "КАМ-003", location: "Парковка А", status: "online", url: "https://maps.garant-service.tv/", fps: 15, detections: [] },
  { id: 4, name: "КАМ-004", location: "Парковка Б", status: "online", url: "https://maps.garant-service.tv/", fps: 15, detections: [] },
  { id: 5, name: "КАМ-005", location: "Периметр Восток", status: "online", url: "https://maps.garant-service.tv/", fps: 20, detections: [] },
  { id: 6, name: "КАМ-006", location: "Периметр Запад", status: "offline", url: "https://maps.garant-service.tv/", fps: 0, detections: [] },
  { id: 7, name: "КАМ-007", location: "Склад №1", status: "online", url: "https://maps.garant-service.tv/", fps: 25, detections: [] },
  { id: 8, name: "КАМ-008", location: "КПП", status: "online", url: "https://maps.garant-service.tv/", fps: 30, detections: [] },
];
