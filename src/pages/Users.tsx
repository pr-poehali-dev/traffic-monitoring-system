import { useState } from "react";
import Icon from "@/components/ui/icon";

interface User {
  id: number;
  login: string;
  role: string;
  status: "active" | "blocked";
  lastSeen: string;
  cameras: number;
}

const INITIAL_USERS: User[] = [
  { id: 1, login: "Полковник", role: "Администратор", status: "active", lastSeen: "Сейчас", cameras: 8 },
  { id: 2, login: "Майор_Смирнов", role: "Оператор", status: "active", lastSeen: "10 мин назад", cameras: 5 },
  { id: 3, login: "Сержант_К", role: "Наблюдатель", status: "blocked", lastSeen: "2 дня назад", cameras: 3 },
  { id: 4, login: "Диспетчер_01", role: "Оператор", status: "active", lastSeen: "1 час назад", cameras: 4 },
];

const ROLES = ["Администратор", "Оператор", "Наблюдатель"];

export default function Users() {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ login: "", role: "Наблюдатель", password: "" });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const toggleStatus = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "active" ? "blocked" : "active" } : u));
  };

  const addUser = () => {
    if (!form.login || !form.password) return;
    const newUser: User = {
      id: Date.now(),
      login: form.login,
      role: form.role,
      status: "active",
      lastSeen: "Только что",
      cameras: 0,
    };
    setUsers(prev => [...prev, newUser]);
    setForm({ login: "", role: "Наблюдатель", password: "" });
    setShowModal(false);
  };

  const deleteUser = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-wider text-foreground">Пользователи</h2>
          <p className="text-xs text-muted-foreground">Активных: {users.filter(u => u.status === "active").length} из {users.length}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-amber text-primary-foreground px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-amber/90 transition-all"
        >
          <Icon name="UserPlus" size={13} />
          Добавить
        </button>
      </div>

      <div className="bg-surface border border-border rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Статус", "Логин", "Роль", "Камеры", "Последний вход", "Действия"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id} className={`border-b border-border/50 hover:bg-surface-2 transition-colors ${i % 2 === 0 ? "" : "bg-surface-2/30"}`}>
                  <td className="px-4 py-3">
                    <div className={`w-2 h-2 rounded-full ${u.status === "active" ? "bg-green-live" : "bg-muted-foreground"}`} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-sm bg-surface-3 border border-border flex items-center justify-center">
                        <span className="text-xs font-bold text-amber">{u.login[0]}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{u.login}</span>
                      {u.login === "Полковник" && (
                        <span className="text-[9px] bg-amber/20 text-amber border border-amber/30 px-1 rounded-sm font-mono">YOU</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm border ${
                      u.role === "Администратор" ? "bg-amber/10 text-amber border-amber/30" :
                      u.role === "Оператор" ? "bg-blue-400/10 text-blue-400 border-blue-400/20" :
                      "bg-surface-3 text-muted-foreground border-border"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-muted-foreground">{u.cameras}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{u.lastSeen}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleStatus(u.id)}
                        disabled={u.login === "Полковник"}
                        className={`p-1.5 rounded-sm border transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                          u.status === "active"
                            ? "border-border text-muted-foreground hover:border-red-alert/40 hover:text-red-alert"
                            : "border-green-live/30 text-green-live hover:bg-green-live/10"
                        }`}
                        title={u.status === "active" ? "Заблокировать" : "Разблокировать"}
                      >
                        <Icon name={u.status === "active" ? "Lock" : "Unlock"} size={11} />
                      </button>
                      <button
                        onClick={() => setDeleteId(u.id)}
                        disabled={u.login === "Полковник"}
                        className="p-1.5 rounded-sm border border-border text-muted-foreground hover:border-red-alert/40 hover:text-red-alert transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Удалить"
                      >
                        <Icon name="Trash2" size={11} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowModal(false)} />
          <div className="relative z-10 w-full max-w-sm bg-surface border border-border rounded-sm animate-fade-in p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider">Новый пользователь</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <Icon name="X" size={14} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Логин</label>
                <input
                  value={form.login}
                  onChange={e => setForm(p => ({ ...p, login: e.target.value }))}
                  className="w-full bg-surface-2 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-amber/60 transition-all"
                  placeholder="Введите логин"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Пароль</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full bg-surface-2 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-amber/60 transition-all"
                  placeholder="Введите пароль"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground uppercase tracking-widest block mb-1">Роль</label>
                <select
                  value={form.role}
                  onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                  className="w-full bg-surface-2 border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-amber/60 transition-all"
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <button
                onClick={addUser}
                disabled={!form.login || !form.password}
                className="w-full bg-amber text-primary-foreground py-2 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-amber/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setDeleteId(null)} />
          <div className="relative z-10 w-full max-w-xs bg-surface border border-red-alert/30 rounded-sm animate-fade-in p-5 text-center">
            <Icon name="AlertTriangle" size={28} className="text-red-alert mx-auto mb-3" />
            <h3 className="text-sm font-bold uppercase mb-1">Удалить пользователя?</h3>
            <p className="text-xs text-muted-foreground mb-4">Это действие нельзя отменить</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 border border-border rounded-sm text-xs font-bold uppercase hover:bg-surface-2 transition-all">Отмена</button>
              <button onClick={() => deleteUser(deleteId)} className="flex-1 py-2 bg-red-alert text-white rounded-sm text-xs font-bold uppercase hover:bg-red-alert/90 transition-all">Удалить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
