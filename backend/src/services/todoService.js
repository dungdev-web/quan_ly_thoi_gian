import TodoRepository from "../repositories/todoRespository.js";
const TodoService = {
  createTodo: (userId, data) => {
    return TodoRepository.createTodo(userId, data);
  },
  getTodosByUser(userId, options) {
    return TodoRepository.findAllByUser(userId, options);
  },
  getTodoById: (id) => TodoRepository.findById(id),
  updateTodo: (id, data) => TodoRepository.update(id, data),
  deleteTodo: (id) => TodoRepository.delete(id),
  updateTodoPosition: (id, position) =>
    TodoRepository.updatePosition(id, position),
  getAchievedTodosByUser: (userId) =>
    TodoRepository.findAchievedTodosByUser(userId),
  serArchivedTodo: (id, archived) =>
    TodoRepository.setArchivedTodo(id, archived),
};

export default TodoService;
