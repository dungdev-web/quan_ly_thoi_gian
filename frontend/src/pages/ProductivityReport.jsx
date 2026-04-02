import { useState, useEffect } from "react";
import { analyzeProductivity } from "../services/aiService";
import {
  getLast7Days,
  getOverview,
  getCategoryStats,
} from "../services/timeslogService";

// ── Mini components ──────────────────────────────────────────

const ScoreRing = ({ score, grade }) => {
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color =
    score >= 80 ? "#16a34a" : score >= 60 ? "#d97706" : "#dc2626";

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-black text-gray-900">{score}</span>
        <span className="text-lg font-bold text-gray-500">{grade}</span>
      </div>
    </div>
  );
};

const MiniBar = ({ day, minutes, maxMinutes, isToday }) => {
  const height = maxMinutes > 0 ? Math.max((minutes / maxMinutes) * 80, 4) : 4;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const label = h > 0 ? `${h}g${m > 0 ? m + "p" : ""}` : `${m}p`;

  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <span className="text-xs text-gray-400">{minutes > 0 ? label : ""}</span>
      <div className="w-full flex items-end justify-center" style={{ height: 84 }}>
        <div
          className={`w-full rounded-t-lg transition-all duration-700 ${
            isToday ? "bg-gray-900" : "bg-gray-300"
          }`}
          style={{ height: `${height}px` }}
        />
      </div>
      <span className={`text-xs font-semibold ${isToday ? "text-gray-900" : "text-gray-400"}`}>
        {day}
      </span>
    </div>
  );
};

const HighlightBadge = ({ type, text }) => (
  <div
    className={`flex items-start gap-2 px-4 py-3 rounded-xl text-sm ${
      type === "positive"
        ? "bg-green-50 border border-green-200 text-green-800"
        : "bg-amber-50 border border-amber-200 text-amber-800"
    }`}
  >
    <span className="flex-shrink-0 mt-0.5">{type === "positive" ? <i className="fa-solid fa-square-check"></i> : <i className="fa-solid fa-triangle-exclamation"></i>}</span>
    <span>{text}</span>
  </div>
);

const StatCard = ({ icon, label, value, sub, color = "gray" }) => {
  const colors = {
    gray: "bg-gray-50 border-gray-200",
    green: "bg-green-50 border-green-200",
    blue: "bg-blue-50 border-blue-200",
    amber: "bg-amber-50 border-amber-200",
  };
  return (
    <div className={`rounded-2xl border-2 p-5 ${colors[color]}`}>
      <div className="text-2xl mb-2"><i className={icon}></i></div>
      <div className="text-2xl font-black text-gray-900">{value}</div>
      <div className="text-sm font-semibold text-gray-700">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
};

// ── Days mapping ─────────────────────────────────────────────
const DAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

// ── Main Page ────────────────────────────────────────────────
export default function ProductivityReport() {
  const [analysis, setAnalysis] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [overview, setOverview] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  // Load chart + stats data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [last7, ov, cats] = await Promise.all([
          getLast7Days(),
          getOverview(),
          getCategoryStats(),
        ]);
        setChartData(last7.result || []);
        setOverview(ov);
        setCategoryStats(cats);
        
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAnalyze = async () => {
    try {
      setAnalyzing(true);
      setError(null);
      const result = await analyzeProductivity();
      setAnalysis(result);
    } catch (err) {
      setError("AI đang bận, thử lại sau!");
    } finally {
      setAnalyzing(false);
    }
  };

  const maxMinutes = Math.max(...chartData.map((d) => d.minutes), 1);
  const totalWeekMinutes = chartData.reduce((s, d) => s + d.minutes, 0);
  const totalWeekHours = (totalWeekMinutes / 60).toFixed(1);
  const maxCatMinutes = Math.max(...categoryStats.map((c) => c.minutes), 1);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Đang tải dữ liệu...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-2xl">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1"> Báo cáo năng suất</h1>
              <p className="text-gray-400 text-sm">Phân tích thói quen làm việc của bạn</p>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {analyzing ? (
                <><i className="fa-solid fa-spinner animate-spin" /> Đang phân tích...</>
              ) : (
                <><span>✨</span> Phân tích AI</>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon="fa-solid fa-clock" label="Hôm nay"
            value={`${Math.floor((overview?.todayMinutes || 0) / 60)}g${(overview?.todayMinutes || 0) % 60}p`}
            sub={`${overview?.todayMinutes || 0} phút`}
            color="blue"
          />
          <StatCard
            icon="fa-solid fa-calendar" label="Tuần này"
            value={`${totalWeekHours}g`}
            sub={`${totalWeekMinutes} phút`}
            color="green"
          />
          <StatCard
            icon="fa-solid fa-square-check" label="Task xong hôm nay"
            value={overview?.tasksDone || 0}
            sub="tasks completed"
            color="amber"
          />
          <StatCard
            icon="fa-solid fa-bullseye" label="Phiên tập trung"
            value={overview?.focusSessions || 0}
            sub="tuần này"
            color="gray"
          />
        </div>

        {/* Chart 7 ngày */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-base font-bold text-gray-900 mb-1">Thời gian làm việc 7 ngày</h2>
          <p className="text-xs text-gray-400 mb-5">Tổng tuần: {totalWeekHours} giờ</p>
          <div className="flex gap-2 items-end px-2">
            {chartData.map((d, i) => (
              <MiniBar
                key={d.date}
                day={DAY_LABELS[i]}
                minutes={d.minutes}
                maxMinutes={maxMinutes}
                isToday={i === new Date().getDay() - 1}
              />
            ))}
          </div>
        </div>

        {/* Category stats */}
        {categoryStats.length > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-base font-bold text-gray-900 mb-5">Thời gian theo danh mục</h2>
            <div className="space-y-3">
              {categoryStats
                .sort((a, b) => b.minutes - a.minutes)
                .map((cat) => {
                  const pct = Math.round((cat.minutes / maxCatMinutes) * 100);
                  const h = Math.floor(cat.minutes / 60);
                  const m = cat.minutes % 60;
                  return (
                    <div key={cat.category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-semibold text-gray-800">{cat.category}</span>
                        <span className="text-gray-500">{h > 0 ? `${h}g ` : ""}{m}p</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-900 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* AI Analysis Result */}
        {!analysis && !analyzing && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border-2 border-dashed border-gray-300 text-center">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Phân tích AI chưa được chạy</h3>
            <p className="text-sm text-gray-500 mb-5">
              Nhấn "Phân tích AI" để nhận báo cáo chi tiết về thói quen và năng suất làm việc của bạn
            </p>
            <button
              onClick={handleAnalyze}
              className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-all"
            >
              ✨ Phân tích ngay
            </button>
          </div>
        )}

        {analyzing && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 text-center">
            <div className="flex justify-center gap-1 mb-4">
              {[0, 150, 300].map((d) => (
                <div
                  key={d}
                  className="w-3 h-3 bg-gray-900 rounded-full animate-bounce"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </div>
            <p className="text-gray-600 font-semibold">AI đang phân tích dữ liệu của bạn...</p>
            <p className="text-gray-400 text-sm mt-1">Thường mất 5-10 giây</p>
          </div>
        )}

        {analysis && (
          <>
            {/* Score + Summary */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-6">
                <div className="relative flex-shrink-0">
                  <ScoreRing score={analysis.score} grade={analysis.grade} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Đánh giá tổng quan</span>
                    {analysis.weekTrend === "up" && (
                      <span className="text-xs bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-semibold">
                        📈 Đang tăng
                      </span>
                    )}
                    {analysis.weekTrend === "down" && (
                      <span className="text-xs bg-red-100 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-semibold">
                        📉 Đang giảm
                      </span>
                    )}
                  </div>
                  <p className="text-gray-800 leading-relaxed">{analysis.summary}</p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    {analysis.peakDay && (
                      <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-xs">
                        <span className="text-gray-500">Ngày đỉnh cao</span>
                        <div className="font-bold text-green-700">{analysis.peakDay} • {Math.floor(analysis.peakMinutes / 60)}g{analysis.peakMinutes % 60}p</div>
                      </div>
                    )}
                    {analysis.worstDay && (
                      <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-xs">
                        <span className="text-gray-500">Ngày yếu nhất</span>
                        <div className="font-bold text-red-600">{analysis.worstDay} • {analysis.worstMinutes}p</div>
                      </div>
                    )}
                    {analysis.topCategory && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-xs">
                        <span className="text-gray-500">Danh mục chính</span>
                        <div className="font-bold text-blue-700">{analysis.topCategory}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Highlights */}
            {analysis.highlights?.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-base font-bold text-gray-900 mb-4">💡 Nhận xét chi tiết</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.highlights.map((h, i) => (
                    <HighlightBadge key={i} type={h.type} text={h.text} />
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions?.length > 0 && (
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 shadow-lg">
                <h2 className="text-base font-bold text-white mb-4"><i className="fa-solid fa-rocket"></i> Gợi ý cải thiện</h2>
                <div className="space-y-3">
                  {analysis.suggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white bg-opacity-10 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-gray-300 text-sm leading-relaxed">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Re-analyze */}
            <div className="text-center pb-4">
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="px-5 py-2.5 bg-white border-2 border-gray-300 text-gray-600 rounded-xl text-sm font-semibold hover:border-gray-900 hover:text-gray-900 transition-all"
              >
                <i className="fa-solid fa-arrows-rotate"></i> Phân tích lại
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}