import { useState } from "react";
import Icon from "@/components/ui/icon";

interface LoginProps {
  onLogin: (user: { login: string; role: string }) => void;
}

const USERS = [
  { login: "Полковник", password: "89223109976", role: "Администратор" },
];

export default function Login({ onLogin }: LoginProps) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      const user = USERS.find(u => u.login === login && u.password === password);
      if (user) {
        onLogin({ login: user.login, role: user.role });
      } else {
        setError("Неверные учётные данные");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <div className="scan-line" />

      <div className="absolute inset-0 opacity-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute border border-amber/20"
            style={{
              left: `${(i % 5) * 25}%`,
              top: `${Math.floor(i / 5) * 25}%`,
              width: "25%",
              height: "25%",
            }}
          />
        ))}
      </div>

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber/3 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 border border-amber/40 rounded-sm mb-4 bg-surface-2 glow-amber animate-pulse-glow">
            <Icon name="Shield" size={32} className="text-amber" />
          </div>
          <h1 className="text-2xl font-black tracking-[0.2em] text-foreground uppercase font-golos">
            СТРАЖ
          </h1>
          <p className="text-muted-foreground text-xs tracking-widest mt-1 uppercase">
            Система мониторинга v2.4
          </p>
        </div>

        <div className="border border-border bg-surface rounded-sm p-6">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border">
            <div className="w-2 h-2 rounded-full bg-amber animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Авторизация
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">
                Позывной / Логин
              </label>
              <div className="relative">
                <Icon name="User" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={login}
                  onChange={e => setLogin(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-sm pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber/60 focus:ring-1 focus:ring-amber/30 transition-all"
                  placeholder="Введите логин"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1.5">
                Пароль
              </label>
              <div className="relative">
                <Icon name="Lock" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-sm pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber/60 focus:ring-1 focus:ring-amber/30 transition-all"
                  placeholder="Введите пароль"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-alert text-xs bg-red-alert/10 border border-red-alert/20 rounded-sm px-3 py-2">
                <Icon name="AlertTriangle" size={12} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !login || !password}
              className="w-full bg-amber text-primary-foreground font-bold text-sm uppercase tracking-widest py-2.5 rounded-sm hover:bg-amber/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Проверка...
                </>
              ) : (
                <>
                  <Icon name="LogIn" size={14} />
                  Войти в систему
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground/40 mt-4 font-mono">
          GARANT-SERVICE © 2024 | ЗАСЕКРЕЧЕНО
        </p>
      </div>
    </div>
  );
}
