import { useState, useEffect } from "react";

import { SartLog, StopLog, getRunningLog } from "../services/timeslogService";
export default function SubtaskModal({ task, onClose, onArchive }) {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleArchive = async () => {
    try {
      setLoading(true);
      await onArchive(task.id);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleStartLog = async () => {
    try {
      await SartLog(task.id);
      setIsRunning(true);
    } catch (error) {
      console.error("Error starting time log:", error);
      alert(error.message || "Lỗi khi bắt đầu theo dõi thời gian!");
    }
  };
  const handleStopLog = async () => {
    try {
      await StopLog();
      setIsRunning(false); // dừng timer
    } catch (error) {
      console.error("Error stopping time log:", error);
    }
  };
  useEffect(() => {
    const fetchRunning = async () => {
      try {
        const log = await getRunningLog();

        if (!log) return; // không có log đang chạy

        // Kiểm tra log này thuộc đúng task
        if (log.todoId === task.id) {
          setIsRunning(true);

          // Tính số giây đã trôi qua từ startTime
          const start = new Date(log.startTime).getTime();
          const now = Date.now();

          const diffSec = Math.floor((now - start) / 1000);
          setSeconds(diffSec);
        }
      } catch (error) {
        console.error("Lỗi lấy time log:", error);
      }
    };

    fetchRunning();
  }, [task.id]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Format đồng hồ: 00:00:00
  const formatTime = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] rounded shadow-lg p-5 relative">
        <button
          onClick={handleArchive}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          {loading ? "Archiving..." : <i className="fa-solid fa-ban"></i>}
        </button>{" "}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-black"
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-3">{task.title}</h2>
        {/* PLAY / PAUSE BUTTON */}
        <button
          onClick={() => {
            if (!isRunning) {
              handleStartLog(); // Bắt đầu log
            } else {
              handleStopLog(); // Gọi API dừng log
            }
          }}
          className="text-xl p-2"
        >
          {isRunning ? (
            <i className="fa-solid fa-pause"></i>
          ) : (
            <i className="fa-solid fa-play"></i>
          )}
        </button>
        {/* Đồng hồ đếm */}
        {isRunning && (
          <div className="mt-2 text-lg font-mono text-green-600">
            ⏱ {formatTime(seconds)}
          </div>
        )}{" "}
        {task.subtasks?.length > 0 ? (
          <ul className="list-disc ml-5 text-gray-700 space-y-2">
            {task.subtasks.map((s) => (
              <li key={s.id}>{s.title}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Không có subtask</p>
        )}
        <div className="text-right mt-4">
          <button
            onClick={onClose}
            className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
