import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { generateDetection, Detection, CAMERAS } from "@/data/cameras";

interface EventRecord extends Detection {
  cam: string;
  camLocation: string;
}

export default function Detections() {
  const [records, setRecords] = useState<EventRecord[]>([]);
  const [search, setSearch] = useState("");
  const [filterSpeed, setFilterSpeed] = useState<"all" | "violation">("all");

  useEffect(() => {
    const initial = Array.from({ length: 25 }).map(() => {
      const cam = CAMERAS[Math.floor(Math.random() * CAMERAS.length)];
      return { ...generateDetection(), cam: cam.name, camLocation: cam.location };
    });
    setRecords(initial);

    const interval = setInterval(() => {
      const cam = CAMERAS.filter(c => c.status === "online")[Math.floor(Math.random() * CAMERAS.filter(c => c.status === "online").length)];
      setRecords(prev => [{ ...generateDetection(), cam: cam.name, camLocation: cam.location }, ...prev].slice(0, 100));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filtered = records.filter(r => {
    const matchSearch = !search || r.plate.toLowerCase().includes(search.toLowerCase()) || r.brand.toLowerCase().includes(search.toLowerCase());
    const matchSpeed = filterSpeed === "all" || r.speed > 60;
    return matchSearch && matchSpeed;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-wider text-foreground">Распознавание номеров</h2>
          <p className="text-xs text-muted-foreground">Записей: {filtered.length}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Icon name="Search" size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по номеру или марке..."
              className="bg-surface border border-border rounded-sm pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber/60 w-56 transition-all"
            />
          </div>
          <div className="flex items-center border border-border rounded-sm overflow-hidden">
            {(["all", "violation"] as const).map(f => (
              <button key={f} onClick={() => setFilterSpeed(f)} className={`px-3 py-1.5 text-xs font-mono transition-all ${filterSpeed === f ? "bg-amber text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {f === "all" ? "Все" : "Превышения"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Время", "Номер", "Марка", "Цвет", "Скорость", "Камера", "Точность"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} className={`border-b border-border/40 hover:bg-surface-2 transition-colors ${i === 0 && !search ? "bg-amber/5" : ""}`}>
                  <td className="px-4 py-2.5 text-[11px] font-mono text-muted-foreground whitespace-nowrap">{r.time}</td>
                  <td className="px-4 py-2.5">
                    <span className="plate-badge text-amber text-sm">{r.plate}</span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-foreground whitespace-nowrap">{r.brand}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{r.color}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm font-mono font-bold ${r.speed > 60 ? "text-red-alert" : "text-green-live"}`}>
                        {r.speed}
                      </span>
                      <span className="text-[10px] text-muted-foreground">км/ч</span>
                      {r.speed > 60 && <Icon name="AlertTriangle" size={11} className="text-red-alert" />}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div>
                      <div className="text-[11px] font-mono text-foreground">{r.cam}</div>
                      <div className="text-[9px] text-muted-foreground">{r.camLocation}</div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1 bg-surface-3 rounded-full overflow-hidden">
                        <div className="h-full bg-amber/60 rounded-full" style={{ width: `${r.confidence}%` }} />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">{r.confidence}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Icon name="SearchX" size={24} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">Ничего не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
}
