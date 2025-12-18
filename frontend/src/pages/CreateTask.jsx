import React, { useEffect, useState } from "react";
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

export default function CreateTask() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openTask, setOpenTask] = useState(null);

  const sortedTodos = [...todos].sort((a, b) => a.position - b.position);

  const fetchTodos = async () => {
    try {
      const data = await getTodos();
      setTodos(data.filter((t) => !t.archived));
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
    } catch (err) {
      alert(err.message || "Lỗi archive task");
    }
  };

  async function onDragEnd(result) {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const taskId = Number(draggableId);
    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const sourceTasks = sortedTodos.filter((t) => t.status === sourceCol);
    const destTasks = sortedTodos.filter((t) => t.status === destCol);

    if (sourceCol === destCol) {
      const items = Array.from(sourceTasks);
      const [moved] = items.splice(source.index, 1);
      items.splice(destination.index, 0, moved);

      await Promise.all(
        items.map((item, index) => updatePosition(item.id, index))
      );

      fetchTodos();
      return;
    }

    const newSource = Array.from(sourceTasks);
    const [moved] = newSource.splice(source.index, 1);

    for (let i = 0; i < newSource.length; i++) {
      await updatePosition(newSource[i].id, i);
    }

    const newDest = Array.from(destTasks);
    moved.status = destCol;
    newDest.splice(destination.index, 0, moved);

    await update(taskId, { status: destCol });

    for (let i = 0; i < newDest.length; i++) {
      await updatePosition(newDest[i].id, i);
    }

    fetchTodos();
  }

  const handleAddTask = async (data) => {
    await addTodo({
      title: data.title,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      dueDate: data.dueDate,
    });
    fetchTodos();
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      fetchTodos();
    } catch (err) {
      alert(err.message);
      console.error("Delete failed:", err);
    }
  };

  const columns = [
    { id: "todo", title: "📋 To Do", color: "from-gray-700 to-gray-800" },
    { id: "In progress", title: "⚡ In Progress", color: "from-gray-800 to-gray-900" },
    { id: "done", title: "✓ Done", color: "from-black to-gray-900" },
  ];

  const getTaskCount = (status) => {
    return sortedTodos.filter((t) => t.status === status).length;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 pl-[280px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Task Manager
              </h1>
              <p className="text-gray-300 text-sm">
                {todos.length} tasks • {getTaskCount("done")} completed
              </p>
            </div>
            <button
              onClick={() => setOpenCreateModal(true)}
              className="bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <span className="text-xl">+</span>
              <span>New Task</span>
            </button>
          </div>
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
                        {sortedTodos
                          .filter((t) => t.status === column.id)
                          .map((task, index) => (
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
                                  className={`bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all cursor-pointer border-2 border-gray-200 hover:border-gray-400 group ${
                                    snapshot.isDragging
                                      ? "ring-2 ring-gray-400 shadow-2xl rotate-2"
                                      : ""
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-semibold text-gray-900 mb-2 truncate">
                                        {task.title}
                                      </h3>
                                      {task.description && (
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                          {task.description}
                                        </p>
                                      )}
                                      {task.dueDate && (
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                          <i className="fa-solid fa-calendar"></i>
                                          <span>
                                            {new Date(task.dueDate).toLocaleDateString("vi-VN")}
                                          </span>
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
                          ))}
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
          onUpdate={update}
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