import SubtaskRepository from "../repositories/subtaskRepository.js";
import TodoRepository from "../repositories/todoRespository.js";

const SubtaskService = {
  createSubtask: async (userId, todoId, data) => {
    const todo = await TodoRepository.findById(todoId);
    if (!todo || todo.userId !== userId) throw new Error("Todo not found");

    return SubtaskRepository.create({ ...data, todoId });
  },

  getSubtasks: async (userId, todoId) => {
    const todo = await TodoRepository.findById(todoId);
    if (!todo || todo.userId !== userId) throw new Error("Todo not found");

    return SubtaskRepository.findByTodoId(todoId);
  },

  updateSubtask: async (userId, subtaskId, data) => {
    const subtask = await SubtaskRepository.findById(subtaskId);
    if (!subtask) throw new Error("Subtask not found");

    const todo = await TodoRepository.findById(subtask.todoId);
    if (todo.userId !== userId) throw new Error("Unauthorized");

    return SubtaskRepository.update(subtaskId, data);
  },

  deleteSubtask: async (userId, subtaskId) => {
    const subtask = await SubtaskRepository.findById(subtaskId);
    if (!subtask) throw new Error("Subtask not found");

    const todo = await TodoRepository.findById(subtask.todoId);
    if (todo.userId !== userId) throw new Error("Unauthorized");

    return SubtaskRepository.delete(subtaskId);
  },
};

export default SubtaskService;
