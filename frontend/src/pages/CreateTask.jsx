import { useEffect, useState } from "react";
import {
  getTodos,
  addTodo,
  deleteTodo,
  updatePosition,
  update,
  setArchivedTodo,
} from "../services/todoService";
import CreateTaskModal from "../components/CreateTaskModal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import SubtaskModal from "../components/SubtaskModal";
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
  // getColumnTasks đọc từ columnOrder thay vì sort theo position
  const getColumnTasks = (status) => {
    return todos
      .filter((t) => t.status === status)
      .filter((t) => {
        // Search
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
        // Deadline filter
        if (filterStatus === "all") return true;
        return getDeadlineStatus(t.dueDate, t.status) === filterStatus;
      })
      .sort((a, b) => a.position - b.position);
  };

  // Hàm kiểm tra status deadline
  const getDeadlineStatus = (dueDate, status) => {
    if (!dueDate || status === "done") return null;

    const now = new Date();
    const due = new Date(dueDate);
    const timeDiff = due.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) return "overdue";
    if (daysDiff === 0) return "today"; 
    if (daysDiff <= 3) return "urgent"; 
    return null;
  };

  const fetchTodos = async () => {
    try {
      const data = await getTodos();
      const filtered = data.filter((t) => !t.archived);
      setTodos(filtered);

      // Build columnOrder từ data
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
    fetchTodos();
  }, []);

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

      // ✅ Update columnOrder NGAY, không đụng todos
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

      // ✅ Update cả 2 cột cùng lúc
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
      console.error("Delete failed:", err);
    }
  };

  const columns = [
    { id: "todo", title: "📋 To Do", color: "from-gray-700 to-gray-800" },
    {
      id: "In progress",
      title: "⚡ In Progress",
      color: "from-gray-800 to-gray-900",
    },
    { id: "done", title: "✓ Done", color: "from-black to-gray-900" },
  ];

  const getTaskCount = (status) => {
    return todos.filter((t) => t.status === status).length;
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
                Task Manager
              </h1>
              <p className="text-gray-400 text-sm">
                {todos.length} tasks • {getTaskCount("done")} completed
              </p>
            </div>
            <button
              onClick={() => setOpenCreateModal(true)}
              className="bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center gap-2 flex-shrink-0"
            >
              <span className="text-xl leading-none">+</span>
              <span>New Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar — tách riêng ra ngoài Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
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

            {/* Filter chips */}
            <div className="flex gap-2 flex-shrink-0">
              {[
                { value: "all", label: "Tất cả" },
                { value: "overdue", label: "🔴 Quá hạn" },
                { value: "today", label: "🟠 Hôm nay" },
                { value: "urgent", label: "🟡 Sắp tới" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilterStatus(f.value)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all whitespace-nowrap
                  ${
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

          {/* Active filter indicator */}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {columns.map((column) => (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-col h-full"
                  >
                    {/* Column Header */}
                    <div
                      className={`bg-gradient-to-br ${column.color} rounded-2xl p-4 mb-4 shadow-lg`}
                    >
                      <div className="flex items-center justify-between">
                        <h2 className="text-white font-bold text-lg">
                          {column.title}
                        </h2>
                        <span className="bg-white bg-opacity-20 text-white text-sm font-bold px-3 py-1 rounded-full">
                          {getTaskCount(column.id)}
                        </span>
                      </div>
                    </div>

                    {/* Column Content */}
                    <div
                      className={`flex-1 bg-white bg-opacity-50 rounded-2xl p-4 min-h-[400px] transition-all ${
                        snapshot.isDraggingOver
                          ? "bg-gray-200 shadow-inner ring-2 ring-gray-400"
                          : ""
                      }`}
                    >
                      <div className="space-y-3">
                        {getColumnTasks(column.id).map((task, index) => {
                          const deadlineStatus = getDeadlineStatus(
                            task.dueDate,
                            task.status,
                          );

                          return (
                            <Draggable
                              key={task.id}
                              draggableId={task.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() => setOpenTask(task)}
                                  className={`bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all cursor-pointer border-2 group ${
                                    deadlineStatus === "overdue"
                                      ? "border-red-600 bg-red-50 ring-2 ring-red-400"
                                      : deadlineStatus === "today"
                                        ? "border-orange-500 bg-orange-50 ring-2 ring-orange-400"
                                        : deadlineStatus === "urgent"
                                          ? "border-yellow-500 bg-yellow-50"
                                          : "border-gray-200 hover:border-gray-400"
                                  } ${
                                    snapshot.isDragging
                                      ? "ring-2 ring-gray-400 shadow-2xl rotate-2"
                                      : ""
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                      <h3
                                        className={`font-semibold mb-2 truncate ${
                                          deadlineStatus === "overdue" ||
                                          deadlineStatus === "today"
                                            ? "text-red-700"
                                            : deadlineStatus === "urgent"
                                              ? "text-orange-700"
                                              : "text-gray-900"
                                        }`}
                                      >
                                        {task.title}
                                      </h3>
                                      {task.description && (
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                          {task.description}
                                        </p>
                                      )}
                                      {task.dueDate && (
                                        <div
                                          className={`flex items-center gap-2 text-xs font-semibold ${
                                            deadlineStatus === "overdue"
                                              ? "text-red-600"
                                              : deadlineStatus === "today"
                                                ? "text-orange-600"
                                                : deadlineStatus === "urgent"
                                                  ? "text-yellow-600"
                                                  : "text-gray-500"
                                          }`}
                                        >
                                          <i className="fa-solid fa-calendar"></i>
                                          <span>
                                            {new Date(
                                              task.dueDate,
                                            ).toLocaleDateString("vi-VN")}
                                          </span>
                                          {deadlineStatus === "overdue" && (
                                            <span className="ml-1 px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">
                                              OVERDUE
                                            </span>
                                          )}
                                          {deadlineStatus === "today" && (
                                            <span className="ml-1 px-2 py-0.5 bg-orange-600 text-white text-xs rounded-full">
                                              TODAY
                                            </span>
                                          )}
                                          {deadlineStatus === "urgent" && (
                                            <span className="ml-1 px-2 py-0.5 bg-yellow-600 text-white text-xs rounded-full">
                                              SOON
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(task.id);
                                      }}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600 flex-shrink-0"
                                    >
                                      <i className="fa-solid fa-trash text-sm"></i>
                                    </button>
                                  </div>

                                  {/* Drag Handle Indicator */}
                                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-center">
                                    <div className="w-12 h-1 bg-gray-200 rounded-full group-hover:bg-gray-400 transition-colors"></div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>

                      {/* Empty State */}
                      {getTaskCount(column.id) === 0 && (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                          <i className="fa-solid fa-inbox text-4xl mb-3 opacity-30"></i>
                          <p className="text-sm font-medium">No tasks yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Droppable>
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
    </div>
  );
}
