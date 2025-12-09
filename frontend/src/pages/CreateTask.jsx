import React, { useEffect, useState } from "react";
import {
  getTodos,
  addTodo,
  deleteTodo,
  updatePosition,
  update,
} from "../services/todoService";
import CreateTaskModal from "../components/CreateTaskModal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import SubtaskModal from "../components/SubtaskModal";
export default function CreateTask() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const sortedTodos = [...todos].sort((a, b) => a.position - b.position);
  const [openTask, setOpenTask] = useState(null);

  // ------------------------------------------
  // DRAG END
  // ------------------------------------------
  async function onDragEnd(result) {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const taskId = Number(draggableId);

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    // Lấy tasks của cột trước
    const sourceTasks = sortedTodos.filter((t) => t.status === sourceCol);
    const destTasks = sortedTodos.filter((t) => t.status === destCol);

    // Kéo trong CÙNG 1 CỘT
    if (sourceCol === destCol) {
      const items = Array.from(sourceTasks);

      // reorder local array
      const [moved] = items.splice(source.index, 1);
      items.splice(destination.index, 0, moved);

      // cập nhật toàn bộ position
      for (let i = 0; i < items.length; i++) {
        await updatePosition(items[i].id, i);
      }

      fetchTodos();
      return;
    }

    // ------------------------------------------------
    // Kéo SANG CỘT MỚI
    // ------------------------------------------------

    // 1. Xóa khỏi cột cũ
    const newSource = Array.from(sourceTasks);
    const [moved] = newSource.splice(source.index, 1);

    for (let i = 0; i < newSource.length; i++) {
      await updatePosition(newSource[i].id, i);
    }

    // 2. Thêm vào cột mới
    const newDest = Array.from(destTasks);
    moved.status = destCol;
    newDest.splice(destination.index, 0, moved);

    // update status
    await update(taskId, destCol);

    // update toàn bộ vị trí cột mới
    for (let i = 0; i < newDest.length; i++) {
      await updatePosition(newDest[i].id, i);
    }

    fetchTodos();
  }

  // ------------------------------------------
  // Fetch todos
  // ------------------------------------------
  const fetchTodos = async () => {
    try {
      const data = await getTodos();
      setTodos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ------------------------------------------
  // ADD
  // ------------------------------------------
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

  // ------------------------------------------
  // TOGGLE
  // ------------------------------------------
  // const handleToggle = async (id, completed) => {
  //   try {
  //     await toggleTodo(id, completed);
  //     fetchTodos();
  //   } catch (err) {
  //     console.error("Toggle failed:", err);
  //   }
  // };

  // ------------------------------------------
  // DELETE
  // ------------------------------------------
  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      fetchTodos();
    } catch (err) {
      alert(err.message);
      console.error("Delete failed:", err);
    }
  };

  // ------------------------------------------
  // 3 CỘT KANBAN
  // ------------------------------------------
  const columns = {
    todo: "Todo",
    "In progess": "In Progress",
    done: "Done",
  };

  if (loading)
    return (
      <div class="loader-wrapper">
        <div class="loader1"></div>
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">My To-Do List</h1>

      <div className="flex gap-2 mb-4 max-w-md mx-auto">
        <button
          onClick={() => setOpenCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 mb-4"
        >
          + Add Task
        </button>
      </div>

      {/* -----------------  KANBAN 3 CỘT ----------------- */}
      <>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="pl-[285px] grid grid-cols-3 gap-4">
            {Object.keys(columns).map((colKey) => (
              <Droppable key={colKey} droppableId={colKey}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-gray-100 p-3 rounded shadow min-h-[350px]"
                  >
                    <h2 className="text-lg font-bold mb-3">
                      {columns[colKey]}
                    </h2>

                    {sortedTodos
                      .filter((t) => t.status === colKey)
                      .map((t, index) => (
                        <Draggable
                          key={t.id}
                          draggableId={t.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white p-3 rounded shadow mb-3 cursor-pointer"
                              onClick={() => setOpenTask(t)} // mở modal
                            >
                              <div className="flex justify-between items-center border-b pb-1">
                                <span>{t.title}</span>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(t.id);
                                  }}
                                  className="text-red-500"
                                >
                                  ❌
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>

        {/* MODAL SUBTASK */}
        {openTask && (
          <SubtaskModal task={openTask} onClose={() => setOpenTask(null)} />
        )}
        {openCreateModal && (
          <CreateTaskModal
            onClose={() => setOpenCreateModal(false)}
            onSubmit={handleAddTask}
          />
        )}
      </>
    </div>
  );
}
