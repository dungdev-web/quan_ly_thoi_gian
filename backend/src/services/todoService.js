import TodoRepository from "../repositories/todoRespository.js";
const TodoService = {
  createTodo: (userId, data) => {
    return TodoRepository.createTodo(userId, data);
  },
  getTodosByUser: (userId) => TodoRepository.findAllByUser(userId),
  getTodoById: (id) => TodoRepository.findById(id),
  updateTodo: (id, data) => TodoRepository.update(id, data),
  deleteTodo: (id) => TodoRepository.delete(id),
  updateTodoPosition: (id, position) =>
    TodoRepository.updatePosition(id, position),
};

export default TodoService;
