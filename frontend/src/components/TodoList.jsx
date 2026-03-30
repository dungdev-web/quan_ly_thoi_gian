import { Droppable, Draggable } from "@hello-pangea/dnd";

export default function TodoList({ column, tasks, getDeadlineStatus, onTaskClick, onDelete, priorityMap = {} }) {
  return (
    <Droppable droppableId={column.id}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col h-full">
          {/* Column Header */}
          <div className={`bg-gradient-to-br ${column.color} rounded-2xl p-4 mb-4 shadow-lg`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-center gap-2 text-white text-center"><i className={` ${column.icon}`}></i><h2 className="font-bold text-lg">{column.title}</h2></div>
              <span className="bg-white bg-opacity-20 text-white text-sm font-bold px-3 py-1 rounded-full">
                {tasks.length}
              </span>
            </div>
          </div>

          {/* Column Content */}
          <div
            className={`flex-1 bg-white bg-opacity-50 rounded-2xl p-4 min-h-[400px] transition-all ${
              snapshot.isDraggingOver ? "bg-gray-200 shadow-inner ring-2 ring-gray-400" : ""
            }`}
          >
            <div className="space-y-3">
              {tasks.map((task, index) => {
                const deadlineStatus = getDeadlineStatus(task.dueDate, task.status);
                return (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => onTaskClick(task)}
                        className={`bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all cursor-pointer border-2 group ${
                          deadlineStatus === "overdue"
                            ? "border-red-600 bg-red-50 ring-2 ring-red-400"
                            : deadlineStatus === "today"
                              ? "border-orange-500 bg-orange-50 ring-2 ring-orange-400"
                              : deadlineStatus === "urgent"
                                ? "border-yellow-500 bg-yellow-50"
                                : "border-gray-200 hover:border-gray-400"
                        } ${snapshot.isDragging ? "ring-2 ring-gray-400 shadow-2xl rotate-2" : ""}`}
                      >
                        {priorityMap[task.id] && (
                          <div className="mb-2 flex items-center gap-1.5">
                            <span className="text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-300 px-2 py-0.5 rounded-full">
                              ✨ #{priorityMap[task.id].priority}
                            </span>
                            <span className="text-xs text-gray-400 truncate">{priorityMap[task.id].reason}</span>
                          </div>
                        )}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h3
                              className={`font-semibold mb-2 truncate ${
                                deadlineStatus === "overdue" || deadlineStatus === "today"
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
                                <span>{new Date(task.dueDate).toLocaleDateString("vi-VN")}</span>
                                {deadlineStatus === "overdue" && (
                                  <span className="ml-1 px-2 py-0.5 bg-red-600 text-white text-xs rounded-full">OVERDUE</span>
                                )}
                                {deadlineStatus === "today" && (
                                  <span className="ml-1 px-2 py-0.5 bg-orange-600 text-white text-xs rounded-full">TODAY</span>
                                )}
                                {deadlineStatus === "urgent" && (
                                  <span className="ml-1 px-2 py-0.5 bg-yellow-600 text-white text-xs rounded-full">SOON</span>
                                )}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600 flex-shrink-0"
                          >
                            <i className="fa-solid fa-trash text-sm"></i>
                          </button>
                        </div>
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
            {tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <i className="fa-solid fa-inbox text-4xl mb-3 opacity-30"></i>
                <p className="text-sm font-medium">No tasks yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Droppable>
  );
}