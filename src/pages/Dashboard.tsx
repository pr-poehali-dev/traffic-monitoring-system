import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { CAMERAS, generateDetection, Detection } from "@/data/cameras";

export default function Dashboard() {
  const [events, setEvents] = useState<(Detection & { cam: string; camId: number })[]>([]);
  const [stats, setStats] = useState({
    totalToday: 143,
    speedViolations: 12,
    avgSpeed: 47,
    recognized: 98.2,
  });

  useEffect(() => {
    const initial = Array.from({ length: 8 }).map(() => {
      const cam = CAMERAS[Math.floor(Math.random() * CAMERAS.length)];
      return { ...generateDetection(), cam: cam.name, camId: cam.id };
    });
    setEvents(initial);

    const interval = setInterval(() => {
      const cam = CAMERAS.filter(c => c.status === "online")[Math.floor(Math.random() * CAMERAS.filter(c => c.status === "online").length)];
      const det = { ...generateDetection(), cam: cam.name, camId: cam.id };
      setEvents(prev => [det, ...prev].slice(0, 50));
      setStats(prev => ({
        ...prev,
        totalToday: prev.totalToday + 1,
        speedViolations: det.speed > 60 ? prev.speedViolations + 1 : prev.speedViolations,
      }));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const onlineCams = CAMERAS.filter(c => c.status === "online").length;
  const alertCams = CAMERAS.filter(c => c.status === "alert").length;

  const statCards = [
    { label: "Камер онлайн", value: `${onlineCams}/${CAMERAS.length}`, icon: "Video", color: "text-green-live", bg: "bg-green-live/10 border-green-live/20" },
    { label: "Авто сегодня", value: stats.totalToday, icon: "Car", color: "text-amber", bg: "bg-amber/10 border-amber/20" },
    { label: "Превышений", value: stats.speedViolations, icon: "Gauge", color: "text-red-alert", bg: "bg-red-alert/10 border-red-alert/20" },
    { label: "Точность распозн.", value: `${stats.recognized}%`, icon: "ScanLine", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold uppercase tracking-wider text-foreground">Сводка системы</h2>
        <p className="text-xs text-muted-foreground">{new Date().toLocaleString("ru-RU", { dateStyle: "full", timeStyle: "short" })}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((s, i) => (
          <div key={i} className={`border rounded-sm p-4 ${s.bg} animate-fade-in`} style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="flex items-start justify-between mb-2">
              <Icon name={s.icon} size={18} className={s.color} />
              {alertCams > 0 && s.label === "Камер онлайн" && (
                <span className="text-[9px] font-mono text-red-alert bg-red-alert/10 px-1 py-0.5 rounded-sm border border-red-alert/20">
                  {alertCams} ТРЕВОГА
                </span>
              )}
            </div>
            <div className={`text-2xl font-black font-mono ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-surface border border-border rounded-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">Поток событий</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">{events.length} записей</span>
          </div>
          <div className="overflow-hidden max-h-80 overflow-y-auto">
            {events.map((e, i) => (
              <div key={e.id} className={`flex items-center gap-3 px-4 py-2.5 border-b border-border/50 ${i === 0 ? "bg-amber/5 animate-fade-in" : ""} hover:bg-surface-2 transition-colors`}>
                <div className="text-[10px] font-mono text-muted-foreground w-14 shrink-0">{e.time}</div>
                <div className="w-px h-4 bg-border" />
                <span className="text-[10px] font-mono text-muted-foreground/70 w-16 shrink-0">{e.cam}</span>
                <div className="w-px h-4 bg-border" />
                <span className="plate-badge text-amber text-xs flex-1">{e.plate}</span>
                <span className="text-xs text-muted-foreground hidden sm:block truncate flex-1">{e.brand}</span>
                <span className={`text-xs font-mono font-bold shrink-0 ${e.speed > 60 ? "text-red-alert" : "text-green-live"}`}>
                  {e.speed} км/ч
                </span>
                {e.speed > 60 && (
                  <div className="w-4 h-4 flex items-center justify-center">
                    <Icon name="AlertTriangle" size={11} className="text-red-alert" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Icon name="Activity" size={13} className="text-amber" />
              <span className="text-xs font-bold uppercase tracking-wider">Состояние камер</span>
            </div>
          </div>
          <div className="p-3 space-y-1.5">
            {CAMERAS.map(cam => (
              <div key={cam.id} className="flex items-center gap-2 p-2 rounded-sm hover:bg-surface-2 transition-colors">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  cam.status === "online" ? "bg-green-live" :
                  cam.status === "alert" ? "bg-red-alert animate-pulse" :
                  "bg-muted-foreground"
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-mono text-foreground">{cam.name}</div>
                  <div className="text-[9px] text-muted-foreground truncate">{cam.location}</div>
                </div>
                <div className="text-right">
                  <div className={`text-[9px] font-mono font-bold ${
                    cam.status === "online" ? "text-green-live" :
                    cam.status === "alert" ? "text-red-alert" :
                    "text-muted-foreground"
                  }`}>
                    {cam.status === "online" ? "ОК" : cam.status === "alert" ? "!!!" : "---"}
                  </div>
                  {cam.status === "online" && (
                    <div className="text-[8px] text-muted-foreground font-mono">{cam.fps}fps</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}