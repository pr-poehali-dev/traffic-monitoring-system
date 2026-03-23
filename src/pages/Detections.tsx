import { useState } from "react";
import Icon from "@/components/ui/icon";

export default function Detections() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-wider text-foreground">Распознавание номеров</h2>
          <p className="text-xs text-muted-foreground">Журнал событий</p>
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
            <button className="px-3 py-1.5 text-xs font-mono bg-amber text-primary-foreground">Все</button>
            <button className="px-3 py-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-all">Превышения</button>
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
          </table>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/40 gap-2">
          <Icon name="ScanLine" size={32} />
          <p className="text-sm">Данные ещё не поступали</p>
          <p className="text-xs">Записи появятся после подключения системы распознавания</p>
        </div>
      </div>
    </div>
  );
}
