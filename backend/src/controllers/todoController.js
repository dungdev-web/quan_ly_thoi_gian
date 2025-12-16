import TodoService from "../services/todoService.js";
const TodoController = {
  create: async (req, res) => {
    try {
      const userId = req.userId;
      const { title, description, startTime, endTime, dueDate } = req.body;

      const data = { title, description, startTime, endTime, dueDate };

      const todo = await TodoService.createTodo(userId, data);

      res.status(201).json(todo);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const userId = Number(req.params.userId);

      const archived = req.query.archived === "true";

      const todos = await TodoService.getTodosByUser(req.userId, { archived });
      res.json(todos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getById: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const todo = await TodoService.getTodoById(id);
      res.json(todo);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const todo = await TodoService.updateTodo(id, req.body);
      res.json(todo);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const id = Number(req.params.id);
      await TodoService.deleteTodo(id);
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updatePosition: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { position } = req.body;
      const todo = await TodoService.updateTodoPosition(id, position);
      res.json(todo);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getAchievedTodos: async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const todos = await TodoService.getAchievedTodosByUser(userId);
      res.json(todos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  setArchivedTodo: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { archived } = req.body;
      const todo = await TodoService.serArchivedTodo(id, archived);
      res.json(todo);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default TodoController;
