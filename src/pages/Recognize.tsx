import { useState } from "react";
import Icon from "@/components/ui/icon";

const API_URL = "https://functions.poehali.dev/4179d26f-ba9a-4e61-b0f2-8188a51edf72";

interface PlateResult {
  plate: string;
  confidence: number;
  vehicle_type: string;
  region: string;
  box: { xmin: number; ymin: number; xmax: number; ymax: number };
}

interface RecognizeResult {
  success: boolean;
  results: PlateResult[];
  count: number;
  processing_time: number;
}

interface HistoryEntry {
  id: string;
  url: string;
  time: string;
  results: PlateResult[];
}

export default function Recognize() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecognizeResult | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const recognize = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка сервера");
        return;
      }

      setResult(data);

      if (data.results.length > 0) {
        setHistory(prev => [{
          id: Math.random().toString(36).slice(2),
          url: url.trim(),
          time: new Date().toLocaleTimeString("ru-RU"),
          results: data.results,
        }, ...prev].slice(0, 50));
      }
    } catch {
      setError("Не удалось выполнить запрос. Проверьте соединение.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") recognize();
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold uppercase tracking-wider text-foreground">Распознавание номеров</h2>
        <p className="text-xs text-muted-foreground">Вставьте ссылку на поток камеры и нажмите «Распознать»</p>
      </div>

      {/* Форма ввода */}
      <div className="bg-surface border border-border rounded-sm p-4">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
          <Icon name="Link" size={13} className="text-amber" />
          <span className="text-xs font-bold uppercase tracking-wider">Ссылка на камеру</span>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Icon name="Camera" size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={handleKey}
              placeholder="http://178.170.233.7/vezd-ab48b37ac3/preview.mp4?token=..."
              className="w-full bg-surface-2 border border-border rounded-sm pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-amber/60 focus:ring-1 focus:ring-amber/20 transition-all font-mono"
            />
          </div>
          <button
            onClick={recognize}
            disabled={loading || !url.trim()}
            className="flex items-center gap-2 bg-amber text-primary-foreground px-5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-amber/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Анализ...
              </>
            ) : (
              <>
                <Icon name="ScanLine" size={13} />
                Распознать
              </>
            )}
          </button>
        </div>

        <p className="text-[10px] text-muted-foreground/60 mt-2">
          Поддерживаются форматы: MP4, JPEG, MJPEG. Откройте камеру на сайте garant-service.tv, скопируйте ссылку из DevTools (F12 → Network).
        </p>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="flex items-center gap-2 text-red-alert text-sm bg-red-alert/10 border border-red-alert/20 rounded-sm px-4 py-3">
          <Icon name="AlertTriangle" size={15} />
          {error}
        </div>
      )}

      {/* Результат */}
      {result && (
        <div className="bg-surface border border-border rounded-sm overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Icon name="ScanLine" size={13} className="text-amber" />
              <span className="text-xs font-bold uppercase tracking-wider">Результат</span>
            </div>
            <div className="flex items-center gap-3">
              {result.processing_time > 0 && (
                <span className="text-[10px] font-mono text-muted-foreground">{result.processing_time.toFixed(2)}с</span>
              )}
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm border ${
                result.count > 0
                  ? "text-green-live bg-green-live/10 border-green-live/20"
                  : "text-muted-foreground bg-surface-2 border-border"
              }`}>
                {result.count > 0 ? `Найдено: ${result.count}` : "Номера не найдены"}
              </span>
            </div>
          </div>

          {result.count === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/40 gap-2">
              <Icon name="SearchX" size={28} />
              <p className="text-sm">На кадре номера не обнаружены</p>
              <p className="text-xs">Попробуйте другой момент времени или другую ссылку</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {result.results.map((r, i) => (
                <div key={i} className="px-4 py-4 flex items-center gap-6 flex-wrap">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Номер</div>
                    <div className="plate-badge text-amber text-xl">{r.plate}</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Точность</div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber"
                          style={{ width: `${r.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono font-bold text-foreground">{r.confidence}%</span>
                    </div>
                  </div>

                  {r.vehicle_type && (
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Тип ТС</div>
                      <div className="text-sm text-foreground capitalize">{r.vehicle_type}</div>
                    </div>
                  )}

                  {r.region && (
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Регион</div>
                      <div className="text-sm font-mono text-foreground">{r.region}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* История */}
      {history.length > 0 && (
        <div className="bg-surface border border-border rounded-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Icon name="History" size={13} className="text-amber" />
              <span className="text-xs font-bold uppercase tracking-wider">История сессии</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">{history.length} запросов</span>
          </div>
          <div className="divide-y divide-border/40 max-h-64 overflow-y-auto">
            {history.map(h => (
              <div
                key={h.id}
                className="px-4 py-2.5 flex items-center gap-3 hover:bg-surface-2 transition-colors cursor-pointer"
                onClick={() => setUrl(h.url)}
              >
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">{h.time}</span>
                <div className="flex gap-1.5 flex-wrap flex-1 min-w-0">
                  {h.results.map((r, i) => (
                    <span key={i} className="plate-badge text-amber text-xs bg-amber/10 border border-amber/20 px-1.5 py-0.5 rounded-sm">
                      {r.plate}
                    </span>
                  ))}
                </div>
                <Icon name="RotateCcw" size={11} className="text-muted-foreground/40 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
