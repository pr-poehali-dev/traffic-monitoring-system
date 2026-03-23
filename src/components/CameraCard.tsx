import Icon from "@/components/ui/icon";
import { Camera } from "@/data/cameras";

interface CameraCardProps {
  camera: Camera;
  onClick: (camera: Camera) => void;
}

export default function CameraCard({ camera, onClick }: CameraCardProps) {
  const statusColors = {
    online: "bg-green-live",
    offline: "bg-muted-foreground",
    alert: "bg-red-alert animate-pulse",
  };

  const statusLabels = {
    online: "В ЭФИРЕ",
    offline: "ОТКЛ.",
    alert: "ТРЕВОГА",
  };

  return (
    <div
      onClick={() => onClick(camera)}
      className={`group relative bg-surface border rounded-sm overflow-hidden cursor-pointer transition-all duration-200 hover:border-amber/50 hover:shadow-lg hover:shadow-amber/5 ${
        camera.status === "alert" ? "border-red-alert/40" : "border-border"
      }`}
    >
      <div className="relative aspect-video bg-surface-2 overflow-hidden">
        {camera.status === "offline" ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Icon name="VideoOff" size={28} className="text-muted-foreground/40" />
            <span className="text-xs text-muted-foreground/40 font-mono">НЕТ СИГНАЛА</span>
          </div>
        ) : (
          <>
            <iframe
              src={camera.url}
              className="w-full h-full border-0 scale-110 pointer-events-none"
              title={camera.name}
              sandbox="allow-scripts allow-same-origin"
            />
            <div className="scanline absolute inset-0 pointer-events-none opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 rounded-sm px-1.5 py-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-alert animate-pulse" />
              <span className="text-[10px] font-mono text-white">REC</span>
            </div>
          </>
        )}
      </div>

      <div className="p-2.5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono text-foreground">{camera.name}</span>
            <span className={`w-1.5 h-1.5 rounded-full ${statusColors[camera.status]}`} />
          </div>
          <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
            <Icon name="MapPin" size={9} />
            {camera.location}
          </div>
        </div>
        <div className="text-right">
          <div className={`text-[9px] font-mono font-bold tracking-wider ${
            camera.status === "online" ? "text-green-live" :
            camera.status === "alert" ? "text-red-alert" : "text-muted-foreground"
          }`}>
            {statusLabels[camera.status]}
          </div>
          {camera.status === "online" && (
            <div className="text-[9px] text-muted-foreground font-mono">{camera.fps} fps</div>
          )}
        </div>
      </div>
    </div>
  );
}
