import { useState, useEffect } from "react";
import { SartLog, StopLog, getRunningLog } from "../services/timeslogService";
import { createSubtask, deleteSubtask } from "../services/subtaskService";

export default function SubtaskModal({ task, onClose, onArchive, onUpdate }) {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionValue, setDescriptionValue] = useState("");
  const [currentTask, setCurrentTask] = useState(task);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [creatingSubtask, setCreatingSubtask] = useState(false);
  const [showSubtaskForm, setShowSubtaskForm] = useState(false);

  const handleCreateSubtask = async () => {
    if (!newSubtaskTitle.trim()) {
      alert("Tên subtask không được để trống");
      return;
    }

    try {
      setCreatingSubtask(true);

      const newSubtask = await createSubtask(task.id, {
        title: newSubtaskTitle,
      });

      // ✅ update UI ngay
      setCurrentTask((prev) => ({
        ...prev,
        subtasks: [...(prev.subtasks || []), newSubtask],
      }));

      setNewSubtaskTitle("");
      setShowSubtaskForm(false);
    } catch (err) {
      console.error("Create subtask error:", err);
      alert(err.message || "Không thể tạo subtask");
    } finally {
      setCreatingSubtask(false);
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      // Gọi API delete nếu có
      await deleteSubtask(subtaskId);

      // ✅ Cập nhật UI ngay
      setCurrentTask((prev) => ({
        ...prev,
        subtasks: prev.subtasks.filter((s) => s.id !== subtaskId),
      }));
    } catch (err) {
      console.error("Delete subtask error:", err);
      alert(err.message || "Không thể xóa subtask");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCreateSubtask();
    }
    if (e.key === "Escape") {
      setShowSubtaskForm(false);
      setNewSubtaskTitle("");
    }
  };

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
      setIsRunning(false);
    } catch (error) {
      console.error("Error stopping time log:", error);
    }
  };

  const handleEditClick = (field, currentValue) => {
    setEditingField(field);
    if (currentValue) {
      const date = new Date(currentValue);
      const localDatetime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setEditValue(localDatetime);
    } else {
      setEditValue("");
    }
  };

  const handleSaveEdit = async () => {
    if (!editValue) {
      alert("Vui lòng chọn thời gian!");
      return;
    }

    try {
      const updateData = {
        [editingField]: new Date(editValue).toISOString(),
      };

      // const updatedTask = await onUpdate(task.id, updateData);
      setCurrentTask({ ...currentTask, ...updateData });
      setEditingField(null);
      setEditValue("");
    } catch (error) {
      console.error("Error updating time:", error);
      alert(error.message || "Lỗi khi cập nhật thời gian!");
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const handleEditDescription = () => {
    setEditingDescription(true);
    setDescriptionValue(currentTask.description || "");
  };

  const handleSaveDescription = async () => {
    try {
      await onUpdate(task.id, { description: descriptionValue });
      setCurrentTask({ ...currentTask, description: descriptionValue });
      setEditingDescription(false);
    } catch (error) {
      console.error("Error updating description:", error);
      alert(error.message || "Lỗi khi cập nhật mô tả!");
    }
  };

  const handleCancelDescription = () => {
    setEditingDescription(false);
    setDescriptionValue("");
  };

  useEffect(() => {
    const fetchRunning = async () => {
      try {
        const log = await getRunningLog();
        if (!log) return;

        if (log.todoId === task.id) {
          setIsRunning(true);
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
    setCurrentTask(task);
  }, [task]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (sec) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Chưa đặt";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const TimeCard = ({ field, icon, label, value, isSpecial = false }) => {
    const isEditing = editingField === field;

    return (
      <div
        className={`${
          isSpecial
            ? "bg-gradient-to-br from-gray-900 to-black border-2 border-gray-800 col-span-2"
            : "bg-white border-2 border-gray-200 hover:border-gray-400"
        } rounded-xl p-5 transition-all shadow-sm group`}
      >
        <div className={`flex items-center mb-3 ${isSpecial ? "text-gray-300" : "text-gray-700"}`}>
          <i className={`${icon} mr-2 text-lg`}></i>
          <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <input
              type="datetime-local"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg hover:bg-black transition-all font-semibold"
              >
                Lưu
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 transition-all font-semibold"
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className={`text-sm font-semibold ${isSpecial ? "text-white" : "text-black"}`}>
              {formatDateTime(value)}
            </div>
            <button
              onClick={() => handleEditClick(field, value)}
              className={`opacity-0 group-hover:opacity-100 transition-opacity ${
                isSpecial ? "text-gray-400 hover:text-white" : "text-gray-400 hover:text-gray-900"
              }`}
            >
              <i className="fa-solid fa-pen text-sm"></i>
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white w-[600px] rounded-3xl shadow-2xl overflow-hidden border border-gray-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-10 rounded-full w-9 h-9 flex items-center justify-center transition-all duration-200"
          >
            ✖
          </button>
          <h2 className="text-3xl font-bold text-white pr-10 mb-2">{currentTask.title}</h2>
          {currentTask.description && (
            <p className="text-gray-300 text-sm leading-relaxed pr-10">
              {currentTask.description}
            </p>
          )}
        </div>

        <div className="p-8 overflow-y-auto flex-1">
          {/* Timer Section */}
          <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-8 mb-6 border-2 border-gray-200 shadow-inner">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => {
                  if (!isRunning) {
                    handleStartLog();
                  } else {
                    handleStopLog();
                  }
                }}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-xl transition-all transform hover:scale-105 active:scale-95 ${
                  isRunning
                    ? "bg-black hover:bg-gray-900 text-white"
                    : "bg-gray-800 hover:bg-gray-900 text-white"
                }`}
              >
                {isRunning ? (
                  <i className="fa-solid fa-pause"></i>
                ) : (
                  <i className="fa-solid fa-play ml-1"></i>
                )}
              </button>

              <div className="text-right">
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">
                  Thời gian đang chạy
                </div>
                <div className="text-5xl font-mono font-bold text-black tracking-tight">
                  {formatTime(seconds)}
                </div>
              </div>
            </div>

            {isRunning && (
              <div className="flex items-center text-gray-700 text-sm font-medium bg-white px-4 py-2 rounded-full shadow-sm">
                <div className="w-2 h-2 bg-black rounded-full animate-pulse mr-2"></div>
                Đang theo dõi thời gian...
              </div>
            )}
          </div>

          {/* Time Information */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <TimeCard
              field="startTime"
              icon="fa-solid fa-clock"
              label="Bắt đầu"
              value={currentTask.startTime}
            />
            <TimeCard
              field="endTime"
              icon="fa-solid fa-flag-checkered"
              label="Kết thúc"
              value={currentTask.endTime}
            />
            <TimeCard
              field="dueDate"
              icon="fa-solid fa-calendar-check"
              label="Hạn chót"
              value={currentTask.dueDate}
              isSpecial={true}
            />
          </div>

          {/* Description Section */}
          {(currentTask.description || editingDescription) && (
            <div className="mb-6 bg-gray-50 rounded-xl p-5 border border-gray-200 group">
              <h3 className="text-xs font-bold text-gray-700 mb-3 flex items-center justify-between uppercase tracking-wide">
                <span>
                  <i className="fa-solid fa-align-left mr-2"></i>
                  Mô tả chi tiết
                </span>
                {!editingDescription && (
                  <button
                    onClick={handleEditDescription}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-900"
                  >
                    <i className="fa-solid fa-pen text-sm"></i>
                  </button>
                )}
              </h3>
              {editingDescription ? (
                <div className="space-y-2">
                  <textarea
                    value={descriptionValue}
                    onChange={(e) => setDescriptionValue(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 resize-none"
                    placeholder="Nhập mô tả..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveDescription}
                      className="flex-1 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg hover:bg-black transition-all font-semibold"
                    >
                      Lưu
                    </button>
                    <button
                      onClick={handleCancelDescription}
                      className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded-lg hover:bg-gray-300 transition-all font-semibold"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {currentTask.description}
                </p>
              )}
            </div>
          )}

          {/* Add Description Button */}
          {!currentTask.description && !editingDescription && (
            <button
              onClick={handleEditDescription}
              className="mb-6 w-full bg-gray-50 rounded-xl p-5 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-all text-gray-400 hover:text-gray-600 text-sm font-medium"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Thêm mô tả
            </button>
          )}

          {/* Subtasks Section - Enhanced */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-gray-700 mb-4 flex items-center uppercase tracking-wide">
              <i className="fa-solid fa-list-check mr-2"></i>
              Subtasks ({currentTask.subtasks?.length || 0})
            </h3>

            {/* Create Subtask Form */}
            {!showSubtaskForm ? (
              <button
                onClick={() => setShowSubtaskForm(true)}
                className="w-full mb-4 px-6 py-4 flex items-center justify-center gap-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 group-hover:bg-gray-300 flex items-center justify-center transition-all">
                  <i className="fa-solid fa-plus text-gray-700"></i>
                </div>
                <span className="font-semibold text-sm">Thêm subtask mới</span>
              </button>
            ) : (
              <div className="bg-white rounded-xl border-2 border-gray-900 p-4 mb-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="fa-solid fa-list-check text-white text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                      Tên subtask
                    </label>
                    <textarea
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Nhập tên công việc con... (Enter để tạo, Esc để hủy)"
                      rows={2}
                      autoFocus
                      className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-opacity-20 resize-none transition-all placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleCreateSubtask}
                    disabled={creatingSubtask || !newSubtaskTitle.trim()}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 text-sm transition-all ${
                      creatingSubtask || !newSubtaskTitle.trim()
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-black active:scale-95"
                    }`}
                  >
                    {creatingSubtask ? (
                      <>
                        <i className="fa-solid fa-spinner animate-spin"></i>
                        Đang tạo...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-check"></i>
                        Tạo
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowSubtaskForm(false);
                      setNewSubtaskTitle("");
                    }}
                    disabled={creatingSubtask}
                    className="flex-1 px-4 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all text-sm disabled:opacity-50"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}

            {/* Subtasks List */}
            {currentTask.subtasks?.length > 0 ? (
              <ul className="space-y-2 overflow-y-auto max-h-[180px] pr-2">
                {currentTask.subtasks.map((s, index) => (
                  <li
                    key={s.id}
                    className="bg-white rounded-xl p-4 text-gray-800 text-sm border-2 border-gray-200 hover:border-gray-400 hover:shadow-md transition-all group flex items-start justify-between"
                  >
                    <div className="flex items-start flex-1 gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center group-hover:scale-110 transition-transform">
                        {index + 1}
                      </span>
                      <span className="flex-1 pt-0.5 break-words">{s.title}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteSubtask(s.id)}
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-600 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 ml-2"
                      title="Xóa subtask"
                    >
                      <i className="fa-solid fa-trash text-xs"></i>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400 text-sm bg-gray-50 rounded-xl p-6 text-center border-2 border-dashed border-gray-300">
                <i className="fa-solid fa-inbox text-2xl mb-2 block text-gray-300"></i>
                Không có subtask
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
            <button
              onClick={handleArchive}
              disabled={loading}
              className="flex-1 px-5 py-3 bg-white border-2 border-gray-900 text-gray-900 rounded-xl hover:bg-gray-900 hover:text-white transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <i className="fa-solid fa-ban"></i>
              {loading ? "Đang xử lý..." : "Lưu trữ"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-5 py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all font-semibold shadow-md"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}