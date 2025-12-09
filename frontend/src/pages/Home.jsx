import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  getTodayLog,
  getOverview,
  getChartData,
} from "../services/timeslogService";
export default function Home() {
  const [todayLog, setTodayLog] = useState(null);
  const [overview, setOverview] = useState(null);
  const [chartData, setChartData] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const todayData = await getTodayLog();
        setTodayLog(todayData);
        const overviewData = await getOverview();
        setOverview(overviewData);
        const chart = await getChartData();
        const formatted = convertToChartFormat(chart);
        setChartData(formatted);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const convertToChartFormat = (chartData) => {
    const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return chartData.result.map((item) => {
      const dateObj = new Date(item.date);

      const dayName = dayMap[dateObj.getDay()];
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");

      return {
        day: `${dayName} (${day}/${month})`, // → Mon (03/12)
        hours: Number((item.minutes / 60).toFixed(2)),
      };
    });
  };

  const convertToHHMM = (minutes) => {
    if (!minutes) return "0m";

    // Nếu dưới 60 phút → chỉ cần phút
    if (minutes < 60) {
      return `${minutes}m`;
    }

    // Nếu từ 60 trở lên → chia giờ + phút
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    return `${h}h${m}m`;
  };

  return (
    <div className="p-10 ml-64">
      {" "}
      <h1 className="text-2xl font-bold mb-6">Time Management Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-5 bg-white shadow rounded-xl">
          <p className="text-gray-500">Today Working Hours</p>
          <h2 className="text-3xl font-bold mt-2">
            {convertToHHMM(overview?.todayMinutes)}
          </h2>
        </div>

        <div className="p-5 bg-white shadow rounded-xl">
          <p className="text-gray-500">This Week</p>
          <h2 className="text-3xl font-bold mt-2">
            {convertToHHMM(overview?.totalWeekMinutes)}
          </h2>
        </div>

        <div className="p-5 bg-white shadow rounded-xl">
          <p className="text-gray-500">Tasks Done</p>
          <h2 className="text-3xl font-bold mt-2">{overview?.tasksDone}</h2>
        </div>

        <div className="p-5 bg-white shadow rounded-xl">
          <p className="text-gray-500">Focus Sessions</p>
          <h2 className="text-3xl font-bold mt-2">{overview?.focusSessions}</h2>
        </div>
      </div>
      {/* CHART */}
      <div className="bg-white shadow rounded-xl p-5 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          Weekly Working Hours 2025
        </h3>

        <div className="w-full h-64">
          <ResponsiveContainer>
            <LineChart data={chartData || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* TASK LIST */}
      <div className="bg-white shadow rounded-xl p-5">
        <h3 className="text-lg font-semibold mb-4">Today's Tasks</h3>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Task</th>
              <th className="py-2">Time</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {todayLog?.logs.map((log) => (
              <tr key={log.id} className="border-b">
                <td className="py-3">{log.todo?.title || "No title"}</td>
                <td>
                  {new Date(log.startTime).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" - "}
                  {log.endTime
                    ? new Date(log.endTime).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--:--"}
                </td>

                <td>
                  <span
                    className={
                      `px-3 py-1 rounded-full text-sm ` +
                      (log.todo?.status === "done"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-500")
                    }
                  >
                    {log.todo?.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
