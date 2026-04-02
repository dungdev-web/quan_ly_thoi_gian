import { useState, useEffect } from "react";
import {
  getTodos,
  addTodo,
  deleteTodo,
  updatePosition,
  update,
  setArchivedTodo,
} from "../services/todoService";
import { getCategoriesByUser } from "../services/categoryService"; // fe service
import { prioritizeTodos } from "../services/aiService";
import CreateTaskModal from "../components/CreateTaskModal";
import { DragDropContext } from "@hello-pangea/dnd";
import SubtaskModal from "../components/SubtaskModal";
import TodoList from "../components/TodoList";
import AIChatbot from "../components/AiChatbot";
import { useToast } from "../components/Toast";
export default function CreateTask() {
  const [todos, setTodos] = useState([]);
  const [columnOrder, setColumnOrder] = useState({});
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openTask, setOpenTask] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [categories, setCategories] = useState([]);

  // ── AI states ──────────────────────────────────────────────
  const [aiPrioritizing, setAiPrioritizing] = useState(false);
  const [priorityMap, setPriorityMap] = useState({}); // { todoId: { priority, reason } }
  const [showPriority, setShowPriority] = useState(false);

  const columns = [
    {
      id: "todo",
      icon: "fa-solid fa-list",
      title: "Cần làm",
      color: "from-gray-700 to-gray-800",
    },
    {
      id: "In progress",
      icon: "fa-solid fa-bolt-lightning",
      title: "Đang làm",
      color: "from-gray-800 to-gray-900",
    },
    {
      id: "done",
      icon: "fa-solid fa-check",
      title: "Hoàn thành",
      color: "from-black to-gray-900",
    },
  ];

  const getDeadlineStatus = (dueDate, status) => {
    if (!dueDate || status === "done") return null;
    const now = new Date();
    const due = new Date(dueDate);
    const daysDiff = Math.ceil(
      (due.setHours(0, 0, 0, 0) - now.setHours(0, 0, 0, 0)) /
        (1000 * 60 * 60 * 24),
    );
    if (daysDiff < 0) return "overdue";
    if (daysDiff === 0) return "today";
    if (daysDiff <= 3) return "urgent";
    return null;
  };

  const getColumnTasks = (status) => {
    return todos
      .filter((t) => t.status === status)
      .filter((t) => {
        if (search.trim()) {
          const q = search.toLowerCase();
          return (
            t.title.toLowerCase().includes(q) ||
            t.description?.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .filter((t) => {
        if (filterStatus === "all") return true;
        return getDeadlineStatus(t.dueDate, t.status) === filterStatus;
      })
      .sort((a, b) => {
        // Nếu đang hiển thị priority AI thì sort theo đó
        if (showPriority && priorityMap[a.id] && priorityMap[b.id]) {
          return priorityMap[a.id].priority - priorityMap[b.id].priority;
        }
        return a.position - b.position;
      });
  };

  const fetchTodos = async () => {
    try {
      const data = await getTodos();
      const filtered = data.filter((t) => !t.archived);
      setTodos(filtered);
      const order = {};
      columns.forEach((col) => {
        order[col.id] = filtered
          .filter((t) => t.status === col.id)
          .sort((a, b) => a.position - b.position)
          .map((t) => t.id);
      });
      setColumnOrder(order);
    } catch (err) {
      console.error(err);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getCategoriesByUser().then(setCategories).catch(console.error);
  }, []);
  useEffect(() => {
    fetchTodos();
  }, []);

  // ── AI: Ưu tiên task ──────────────────────────────────────
  const handleAIPrioritize = async () => {
    const pendingTodos = todos.filter((t) => t.status !== "done");
    if (pendingTodos.length === 0) {
      toast("Không có task nào cần ưu tiên!", "error");
      return;
    }
    try {
      setAiPrioritizing(true);
      const result = await prioritizeTodos(
        pendingTodos.map((t) => ({
          id: t.id,
          title: t.title,
          dueDate: t.dueDate,
          status: t.status,
        })),
      );
      const map = {};
      result.prioritized.forEach((p) => {
        map[p.id] = { priority: p.priority, reason: p.reason };
      });
      setPriorityMap(map);
      setShowPriority(true);
      toast(result.tip || "AI đã sắp xếp ưu tiên!", "success");
    } catch (err) {
      toast("AI đang bận, thử lại sau!", "error");
    } finally {
      setAiPrioritizing(false);
    }
  };

  const handleArchiveTodo = async (todoId) => {
    try {
      await setArchivedTodo(todoId, true);
      setTodos((prev) => prev.filter((t) => t.id !== todoId));
      setOpenTask(null);
      toast("Task archived successfully", "success");
    } catch (err) {
      toast("Failed to archive task", "error");
    }
  };

  const handleUpdateTask = async (taskId, data) => {
    const updatedTask = await update(taskId, data);
    setTodos((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updatedTask } : t)),
    );
    return updatedTask;
  };

  async function onDragEnd(result) {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const taskId = Number(draggableId);
    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    if (sourceCol === destCol) {
      const newIds = [...(columnOrder[sourceCol] || [])];
      const [movedId] = newIds.splice(source.index, 1);
      newIds.splice(destination.index, 0, movedId);
      setColumnOrder((prev) => ({ ...prev, [sourceCol]: newIds }));
      try {
        await Promise.all(newIds.map((id, i) => updatePosition(id, i)));
      } catch (err) {
        console.error("Drag failed", err);
        fetchTodos();
      }
    } else {
      const newSourceIds = [...(columnOrder[sourceCol] || [])];
      const newDestIds = [...(columnOrder[destCol] || [])];
      const [movedId] = newSourceIds.splice(source.index, 1);
      newDestIds.splice(destination.index, 0, movedId);
      setColumnOrder((prev) => ({
        ...prev,
        [sourceCol]: newSourceIds,
        [destCol]: newDestIds,
      }));
      setTodos((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: destCol } : t)),
      );
      try {
        await Promise.all([
          update(taskId, { status: destCol }),
          ...newSourceIds.map((id, i) => updatePosition(id, i)),
          ...newDestIds.map((id, i) => updatePosition(id, i)),
        ]);
      } catch (err) {
        console.error("Drag failed", err);
        fetchTodos();
      }
    }
  }

  const handleAddTask = async (data) => {
    await addTodo({
      title: data.title,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      dueDate: data.dueDate,
    });
    toast("Task created successfully", "success");
    fetchTodos();
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      toast("Task deleted successfully", "success");
      fetchTodos();
    } catch (err) {
      toast("Failed to delete task", "error");
    }
  };

  const getTaskCount = (status) =>
    todos.filter((t) => t.status === status).length;

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold text-lg">Đang tải...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-2xl">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
                Quản lý task
              </h1>
              <p className="text-gray-400 text-sm">
                {todos.length} tasks • {getTaskCount("done")} hoàn thành
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* AI Prioritize Button */}
              <button
                onClick={
                  showPriority
                    ? () => setShowPriority(false)
                    : handleAIPrioritize
                }
                disabled={aiPrioritizing}
                className={`px-4 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 text-sm ${
                  showPriority
                    ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                    : "bg-white bg-opacity-10 text-white border border-white border-opacity-20 hover:bg-opacity-20"
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                {aiPrioritizing ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin"></i> Đang
                    phân tích...
                  </>
                ) : showPriority ? (
                  <>
                    <i className="fa-solid fa-xmark"></i> Tắt AI
                  </>
                ) : (
                  <>
                    <span>✨</span> AI ưu tiên
                  </>
                )}
              </button>
              <button
                onClick={() => setOpenCreateModal(true)}
                className="bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <span className="text-xl leading-none">+</span>
                <span>Task mới</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Priority Banner */}
      {showPriority && (
        <div className="bg-yellow-50 border-b-2 border-yellow-300">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2 text-sm text-yellow-800">
            <span>✨</span>
            <span className="font-semibold">AI đang sắp xếp ưu tiên —</span>
            <span>tasks được sort theo mức độ quan trọng.</span>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type="text"
                placeholder="Tìm kiếm task..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-10 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-gray-900 text-sm font-medium transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {[
                { value: "all", label: "Tất cả" },
                { value: "overdue", label: "Quá hạn" },
                { value: "today", label: "Hôm nay" },
                { value: "urgent", label: "Sắp tới" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilterStatus(f.value)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all whitespace-nowrap ${
                    filterStatus === f.value
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-white"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          {(search || filterStatus !== "all") && (
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <i className="fa-solid fa-filter"></i>
              <span>
                Tìm thấy{" "}
                <strong className="text-gray-900">
                  {columns.reduce(
                    (acc, col) => acc + getColumnTasks(col.id).length,
                    0,
                  )}
                </strong>{" "}
                task
              </span>
              <button
                onClick={() => {
                  setSearch("");
                  setFilterStatus("all");
                }}
                className="ml-1 text-gray-400 hover:text-gray-900 font-semibold underline underline-offset-2"
              >
                Xóa filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {columns.map((column) => (
              <TodoList
                key={column.id}
                column={column}
                tasks={getColumnTasks(column.id)}
                getDeadlineStatus={getDeadlineStatus}
                onTaskClick={setOpenTask}
                onDelete={handleDelete}
                priorityMap={showPriority ? priorityMap : {}}
              />
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Modals */}
      {openTask && (
        <SubtaskModal
          task={openTask}
          onClose={() => setOpenTask(null)}
          onArchive={handleArchiveTodo}
          onUpdate={handleUpdateTask}
        />
      )}
      {openCreateModal && (
        <CreateTaskModal
          onClose={() => setOpenCreateModal(false)}
          onSubmit={handleAddTask}
        />
      )}

      {/* AI Chatbot */}
      <AIChatbot
        todos={todos}
        categories={categories}
        onCreateTask={(createdTodo) => {
          setTodos((prev) => [...prev, createdTodo]);
        }}
        onDeleteTasks={(deletedIds) => {
          setTodos((prev) => prev.filter((t) => !deletedIds.includes(t.id)));
        }}
      />
    </div>
  );
}
