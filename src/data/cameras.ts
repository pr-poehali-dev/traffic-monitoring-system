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

const PLATES = [
  "А123ВС777", "В456МК199", "Е789НО77", "К012РС178", "М345ТУ750",
  "Н678ФХ116", "О901ЦЧ161", "П234ШЩ164", "Р567ЪЫ163", "С890ЬЭ152",
  "Т123ЮЯ154", "У456АВ174", "Х789ГД177", "Ц012ЕЖ197", "Ч345ЗИ198",
];
const BRANDS = ["Toyota Camry", "BMW X5", "Lada Vesta", "Mercedes C-Class", "Hyundai Solaris", "KIA Rio", "Volkswagen Polo", "Ford Focus", "Renault Logan", "Mazda 6"];
const COLORS = ["Белый", "Чёрный", "Серебристый", "Серый", "Красный", "Синий"];

export function generateDetection(): Detection {
  return {
    id: Math.random().toString(36).slice(2),
    plate: PLATES[Math.floor(Math.random() * PLATES.length)],
    speed: Math.floor(Math.random() * 80) + 20,
    time: new Date().toLocaleTimeString("ru-RU"),
    brand: BRANDS[Math.floor(Math.random() * BRANDS.length)],
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    confidence: Math.floor(Math.random() * 15) + 85,
  };
}

export const CAMERAS: Camera[] = [
  { id: 1, name: "КАМ-001", location: "Въезд главный", status: "online", url: "https://maps.garant-service.tv/", fps: 25, detections: [generateDetection(), generateDetection()] },
  { id: 2, name: "КАМ-002", location: "Выезд северный", status: "online", url: "https://maps.garant-service.tv/", fps: 25, detections: [generateDetection()] },
  { id: 3, name: "КАМ-003", location: "Парковка А", status: "online", url: "https://maps.garant-service.tv/", fps: 15, detections: [generateDetection(), generateDetection(), generateDetection()] },
  { id: 4, name: "КАМ-004", location: "Парковка Б", status: "alert", url: "https://maps.garant-service.tv/", fps: 15, detections: [generateDetection()] },
  { id: 5, name: "КАМ-005", location: "Периметр Восток", status: "online", url: "https://maps.garant-service.tv/", fps: 20, detections: [] },
  { id: 6, name: "КАМ-006", location: "Периметр Запад", status: "offline", url: "https://maps.garant-service.tv/", fps: 0, detections: [] },
  { id: 7, name: "КАМ-007", location: "Склад №1", status: "online", url: "https://maps.garant-service.tv/", fps: 25, detections: [generateDetection()] },
  { id: 8, name: "КАМ-008", location: "КПП", status: "online", url: "https://maps.garant-service.tv/", fps: 30, detections: [generateDetection(), generateDetection()] },
];
