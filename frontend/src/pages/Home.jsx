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
        day: `${dayName} (${day}/${month})`,
        hours: Number((item.minutes / 60).toFixed(2)),
      };
    });
  };

  const convertToHHMM = (minutes) => {
    if (!minutes) return "0m";
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h${m}m`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-lg border-2 border-gray-900">
          <p className="text-sm font-semibold text-gray-900">{payload[0].payload.day}</p>
          <p className="text-lg font-bold text-gray-900 mt-1">
            {payload[0].value} hours
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white ml-64">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Dashboard
              </h1>
              <p className="text-gray-300 text-sm">
                Welcome back! Here's your productivity overview
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-gray-400 text-xs uppercase tracking-wide">Today</p>
                <p className="text-white text-lg font-bold">
                  {new Date().toLocaleDateString("en-US", { 
                    month: "short", 
                    day: "numeric",
                    year: "numeric"
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center">
                <i className="fa-solid fa-clock text-white text-xl"></i>
              </div>
            </div>
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">
              Today Working Hours
            </p>
            <h2 className="text-4xl font-bold text-gray-900">
              {convertToHHMM(overview?.todayMinutes)}
            </h2>
          </div>

          <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center">
                <i className="fa-solid fa-calendar-week text-white text-xl"></i>
              </div>
            </div>
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">
              This Week
            </p>
            <h2 className="text-4xl font-bold text-gray-900">
              {convertToHHMM(overview?.totalWeekMinutes)}
            </h2>
          </div>

          <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center">
                <i className="fa-solid fa-circle-check text-white text-xl"></i>
              </div>
            </div>
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">
              Tasks Done
            </p>
            <h2 className="text-4xl font-bold text-gray-900">
              {overview?.tasksDone || 0}
            </h2>
          </div>

          <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center">
                <i className="fa-solid fa-fire text-white text-xl"></i>
              </div>
            </div>
            <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-2">
              Focus Sessions
            </p>
            <h2 className="text-4xl font-bold text-gray-900">
              {overview?.focusSessions || 0}
            </h2>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white border-2 border-gray-900 rounded-2xl p-8 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                Weekly Working Hours
              </h3>
              <p className="text-gray-600 text-sm">Your productivity trend for 2025</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <div className="w-3 h-3 rounded-full bg-gray-900"></div>
              <span className="text-sm font-semibold text-gray-700">Hours</span>
            </div>
          </div>

          <div className="w-full h-80">
            <ResponsiveContainer>
              <LineChart data={chartData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="day" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px', fontWeight: '600' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px', fontWeight: '600' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#000000"
                  strokeWidth={3}
                  dot={{ fill: '#000000', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: '#000000' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white border-2 border-gray-900 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                Today's Tasks
              </h3>
              <p className="text-gray-600 text-sm">
                {todayLog?.logs?.length || 0} tasks tracked today
              </p>
            </div>
          </div>

          {todayLog?.logs?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-900">
                    <th className="py-4 px-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">
                      Task
                    </th>
                    <th className="py-4 px-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">
                      Time
                    </th>
                    <th className="py-4 px-4 text-left text-sm font-bold text-gray-900 uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {todayLog.logs.map((log, index) => (
                    <tr 
                      key={log.id} 
                      className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="py-4 px-4">
                        <p className="font-semibold text-gray-900">
                          {log.todo?.title || "No title"}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-700 font-medium">
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
                            : "Running"}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-4 py-2 rounded-lg text-sm font-bold inline-block ${
                            log.todo?.status === "done"
                              ? "bg-gray-900 text-white"
                              : log.todo?.status === "in-progress"
                              ? "bg-gray-200 text-gray-900"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {log.todo?.status || "unknown"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-clipboard-list text-4xl text-gray-300"></i>
              </div>
              <p className="text-gray-500 font-semibold text-lg">No tasks tracked today</p>
              <p className="text-gray-400 text-sm mt-2">Start tracking your tasks to see them here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}