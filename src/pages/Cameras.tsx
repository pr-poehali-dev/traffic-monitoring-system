import { useState } from "react";
import Icon from "@/components/ui/icon";
import CameraCard from "@/components/CameraCard";
import CameraModal from "@/components/CameraModal";
import { CAMERAS, Camera } from "@/data/cameras";

export default function Cameras() {
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [filter, setFilter] = useState<"all" | "online" | "offline" | "alert">("all");
  const [layout, setLayout] = useState<2 | 3 | 4>(3);

  const filtered = CAMERAS.filter(c => filter === "all" || c.status === filter);

  const counts = {
    online: CAMERAS.filter(c => c.status === "online").length,
    offline: CAMERAS.filter(c => c.status === "offline").length,
    alert: CAMERAS.filter(c => c.status === "alert").length,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-wider text-foreground">Камеры наблюдения</h2>
          <p className="text-xs text-muted-foreground">Всего объектов: {CAMERAS.length}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {(["all", "online", "offline", "alert"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-sm border transition-all ${
                filter === f
                  ? "bg-amber text-primary-foreground border-amber"
                  : "border-border text-muted-foreground hover:border-amber/40 hover:text-foreground"
              }`}
            >
              {f === "all" ? `Все (${CAMERAS.length})` :
               f === "online" ? `В эфире (${counts.online})` :
               f === "offline" ? `Откл. (${counts.offline})` :
               `Тревога (${counts.alert})`}
            </button>
          ))}

          <div className="flex items-center border border-border rounded-sm overflow-hidden">
            {([2, 3, 4] as const).map(n => (
              <button
                key={n}
                onClick={() => setLayout(n)}
                className={`px-2.5 py-1.5 text-xs font-mono transition-all ${
                  layout === n ? "bg-amber/20 text-amber" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {n}×
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`grid gap-3 ${
        layout === 2 ? "grid-cols-1 md:grid-cols-2" :
        layout === 3 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" :
        "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      }`}>
        {filtered.map(camera => (
          <CameraCard key={camera.id} camera={camera} onClick={setSelectedCamera} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Icon name="Video" size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">Камеры не найдены</p>
        </div>
      )}

      {selectedCamera && (
        <CameraModal camera={selectedCamera} onClose={() => setSelectedCamera(null)} />
      )}
    </div>
  );
}
