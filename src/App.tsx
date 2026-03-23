import { useState } from "react";
import Icon from "@/components/ui/icon";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Cameras from "@/pages/Cameras";
import Users from "@/pages/Users";
import Detections from "@/pages/Detections";
import Recognize from "@/pages/Recognize";

type Page = "dashboard" | "cameras" | "detections" | "users" | "recognize";

interface User {
  login: string;
  role: string;
}

const NAV_ITEMS = [
  { id: "dashboard" as Page, label: "Сводка", icon: "LayoutDashboard" },
  { id: "cameras" as Page, label: "Камеры", icon: "Video" },
  { id: "recognize" as Page, label: "Распознать", icon: "ScanSearch" },
  { id: "detections" as Page, label: "История", icon: "History" },
  { id: "users" as Page, label: "Пользователи", icon: "Users" },
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [time, setTime] = useState(new Date().toLocaleTimeString("ru-RU"));

  useState(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString("ru-RU")), 1000);
    return () => clearInterval(t);
  });

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-golos">
      <div className="scan-line" />

      <header className="border-b border-border bg-surface h-12 flex items-center justify-between px-4 shrink-0 z-30 relative">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(p => !p)}
            className="w-7 h-7 flex items-center justify-center rounded-sm border border-border text-muted-foreground hover:text-foreground hover:border-amber/40 transition-all"
          >
            <Icon name={sidebarOpen ? "PanelLeftClose" : "PanelLeft"} size={13} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border border-amber/50 rounded-sm flex items-center justify-center bg-amber/10">
              <Icon name="Shield" size={12} className="text-amber" />
            </div>
            <span className="text-sm font-black tracking-[0.15em] text-foreground uppercase">СТРАЖ</span>
            <span className="hidden sm:block text-muted-foreground/40 text-xs">|</span>
            <span className="hidden sm:block text-[10px] text-muted-foreground/60 font-mono uppercase tracking-wider">Мониторинг</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-surface-2 border border-border rounded-sm px-3 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-live animate-pulse" />
            <span className="text-[10px] font-mono text-muted-foreground">СИСТЕМА АКТИВНА</span>
            <span className="text-[10px] font-mono text-amber">{time}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-amber/15 border border-amber/30 flex items-center justify-center">
              <span className="text-xs font-bold text-amber">{user.login[0]}</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-medium text-foreground leading-none">{user.login}</div>
              <div className="text-[9px] text-muted-foreground mt-0.5">{user.role}</div>
            </div>
          </div>

          <button
            onClick={() => setUser(null)}
            className="w-7 h-7 flex items-center justify-center rounded-sm border border-border text-muted-foreground hover:text-red-alert hover:border-red-alert/40 transition-all"
            title="Выйти"
          >
            <Icon name="LogOut" size={12} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className={`${sidebarOpen ? "w-52" : "w-0"} shrink-0 transition-all duration-200 overflow-hidden border-r border-border bg-surface z-20 relative`}>
          <nav className="p-2 space-y-0.5 pt-3">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-left transition-all group ${
                  page === item.id
                    ? "bg-amber/15 text-amber border border-amber/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface-2 border border-transparent"
                }`}
              >
                <Icon name={item.icon} size={15} className={page === item.id ? "text-amber" : "text-muted-foreground group-hover:text-foreground"} />
                <span className="text-xs font-medium uppercase tracking-wider">{item.label}</span>
                {page === item.id && (
                  <div className="ml-auto w-1 h-1 rounded-full bg-amber" />
                )}
              </button>
            ))}
          </nav>

          <div className="absolute bottom-0 left-0 w-52 p-3 border-t border-border bg-surface">
            <div className="grid grid-cols-3 gap-1 text-center">
              {[
                { label: "КАМ", value: "8", color: "text-amber" },
                { label: "ОНЛ", value: "6", color: "text-green-live" },
                { label: "АЛ", value: "1", color: "text-red-alert" },
              ].map(s => (
                <div key={s.label} className="bg-surface-2 rounded-sm py-1.5">
                  <div className={`text-sm font-mono font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-[8px] text-muted-foreground font-mono">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-auto p-5 pb-16">
          <div className="animate-fade-in" key={page}>
            {page === "dashboard" && <Dashboard />}
            {page === "cameras" && <Cameras />}
            {page === "recognize" && <Recognize />}
            {page === "detections" && <Detections />}
            {page === "users" && <Users />}
          </div>
        </main>
      </div>
    </div>
  );
}