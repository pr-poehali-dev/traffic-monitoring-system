import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { Camera, Detection, generateDetection } from "@/data/cameras";

interface CameraModalProps {
  camera: Camera;
  onClose: () => void;
}

export default function CameraModal({ camera, onClose }: CameraModalProps) {
  const [detections, setDetections] = useState<Detection[]>([...camera.detections]);

  useEffect(() => {
    if (camera.status !== "online") return;
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        const det = generateDetection();
        setDetections(prev => [det, ...prev].slice(0, 20));
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [camera.status]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-5xl bg-surface border border-border rounded-sm animate-fade-in flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${camera.status === "online" ? "bg-green-live animate-pulse" : camera.status === "alert" ? "bg-red-alert animate-pulse" : "bg-muted-foreground"}`} />
              <span className="font-mono font-bold text-foreground text-sm">{camera.name}</span>
            </div>
            <span className="text-muted-foreground text-xs">|</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Icon name="MapPin" size={11} />
              {camera.location}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-red-alert/15 border border-red-alert/30 rounded-sm px-2 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-alert animate-pulse" />
              <span className="text-[10px] font-mono text-red-alert font-bold">REC LIVE</span>
            </div>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center border border-border rounded-sm text-muted-foreground hover:text-foreground hover:border-amber/40 transition-all">
              <Icon name="X" size={14} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 relative bg-black">
            {camera.status === "offline" ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <Icon name="VideoOff" size={48} className="text-muted-foreground/30" />
                <span className="font-mono text-muted-foreground/40 text-sm uppercase tracking-widest">Нет сигнала</span>
              </div>
            ) : (
              <>
                <iframe
                  src={camera.url}
                  className="w-full h-full border-0"
                  title={camera.name}
                  sandbox="allow-scripts allow-same-origin allow-popups"
                />
                <div className="scanline absolute inset-0 pointer-events-none opacity-20" />
                <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none">
                  <div className="bg-black/70 border border-amber/20 rounded-sm px-2 py-1">
                    <div className="text-amber text-[10px] font-mono font-bold">{camera.name} — {camera.location.toUpperCase()}</div>
                    <div className="text-muted-foreground text-[9px] font-mono">{new Date().toLocaleString("ru-RU")}</div>
                  </div>
                  <div className="bg-black/70 border border-border rounded-sm px-2 py-1 text-[10px] font-mono text-muted-foreground">
                    {camera.fps} fps | HD
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="w-72 border-l border-border flex flex-col overflow-hidden">
            <div className="px-3 py-2.5 border-b border-border">
              <div className="flex items-center gap-2">
                <Icon name="ScanLine" size={13} className="text-amber" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">Распознавание</span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                Обнаружено за сессию: <span className="text-amber font-mono font-bold">{detections.length}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {detections.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-24 text-muted-foreground/40 text-xs gap-1">
                  <Icon name="SearchX" size={18} />
                  <span>Нет данных</span>
                </div>
              ) : (
                detections.map((d, i) => (
                  <div key={d.id} className={`px-3 py-2.5 border-b border-border/50 ${i === 0 ? "bg-amber/5" : ""}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="plate-badge text-amber text-sm">{d.plate}</span>
                      <span className={`text-xs font-mono font-bold ${d.speed > 60 ? "text-red-alert" : "text-green-live"}`}>
                        {d.speed} км/ч
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground truncate">{d.brand} · {d.color}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{d.time}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      <div className="flex-1 h-0.5 bg-surface-3 rounded-full overflow-hidden">
                        <div className="h-full bg-amber/60 rounded-full" style={{ width: `${d.confidence}%` }} />
                      </div>
                      <span className="text-[9px] font-mono text-muted-foreground">{d.confidence}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="px-3 py-2.5 border-t border-border grid grid-cols-2 gap-2">
              <div className="bg-surface-2 rounded-sm p-2 text-center">
                <div className="text-amber font-mono font-bold text-sm">{detections.filter(d => d.speed > 60).length}</div>
                <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Превышений</div>
              </div>
              <div className="bg-surface-2 rounded-sm p-2 text-center">
                <div className="text-green-live font-mono font-bold text-sm">{detections.length}</div>
                <div className="text-[9px] text-muted-foreground uppercase tracking-wider">Всего авто</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
