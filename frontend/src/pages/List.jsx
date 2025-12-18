import React, { useEffect, useState } from "react";
import { getArchivedTodos, setArchivedTodo } from "../services/todoService";
import {
  Archive,
  Calendar,
  Clock,
  Tag,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import { update } from "../services/todoService";
export default function ListTask() {
  const [archivedTodos, setArchivedTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchArchivedTodos();
  }, []);

  const fetchArchivedTodos = async () => {
    try {
      setLoading(true);
      const data = await getArchivedTodos();
      setArchivedTodos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleUnarchive = async (id) => {
    try {
      // 1️⃣ bỏ archived
      await setArchivedTodo(id, false);
      // 2️⃣ đổi status (tùy bạn muốn về cột nào)
      await update(id, { status: "In progress" });

      // 3️⃣ XÓA khỏi list archived → UI biến mất ngay
      setArchivedTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err.message || "Không thể hoàn tác công việc");
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-green-100 text-green-800 border-green-200",
    };
    return colors[priority] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusColor = (status) => {
    const colors = {
      done: "bg-green-100 text-green-800 border-green-200",
      "In progress": "bg-blue-100 text-blue-800 border-blue-200",
      pending: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-gray-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl ml-[285px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Archive className="w-8 h-8 text-gray-700" />
            <h1 className="text-3xl font-bold text-gray-800">
              Công việc đã lưu trữ
            </h1>
          </div>
          <p className="text-gray-600">
            Tổng cộng {archivedTodos.length} công việc đã được lưu trữ
          </p>
        </div>

        {/* Todo List */}
        {archivedTodos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Archive className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Chưa có công việc nào được lưu trữ
            </h3>
            <p className="text-gray-500">
              Các công việc đã hoàn thành sẽ hiển thị ở đây
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archivedTodos.map((todo) => (
              <div
                key={todo.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-4 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white truncate">
                    {todo.title}
                  </h3>
                  {/* 🔁 HOÀN TÁC */}
                  <button
                    onClick={() => handleUnarchive(todo.id)}
                    className="flex items-center gap-1 text-sm bg-white text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Hoàn tác
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-5">
                  {/* Description */}
                  {todo.description && (
                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {todo.description}
                    </p>
                  )}

                  {/* Status and Priority */}
                  <div className="flex gap-2 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        todo.status
                      )}`}
                    >
                      {todo.status === "done"
                        ? "Hoàn thành"
                        : todo.status === "In progress"
                        ? "Đang thực hiện"
                        : "Chờ xử lý"}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(
                        todo.priority
                      )}`}
                    >
                      {todo.priority === "high"
                        ? "Cao"
                        : todo.priority === "medium"
                        ? "Trung bình"
                        : "Thấp"}
                    </span>
                  </div>

                  {/* Time Information */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">Bắt đầu:</span>
                      <span>{formatDateTime(todo.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-red-500" />
                      <span className="font-medium">Kết thúc:</span>
                      <span>{formatDateTime(todo.endTime)}</span>
                    </div>
                    {todo.dueDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <span className="font-medium">Hạn chót:</span>
                        <span>{formatDate(todo.dueDate)}</span>
                      </div>
                    )}
                  </div>

                  {/* Category */}
                  {todo.category && (
                    <div className="mt-4 flex items-center gap-2">
                      <Tag className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {todo.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Lưu trữ lúc: {formatDateTime(todo.updatedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
