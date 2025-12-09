import SubtaskService from "../services/subtaskService.js";

const SubtaskController = {
  create: async (req, res) => {
    try {
      const todoId = Number(req.params.todoId); // lấy todoId từ route
      const userId = req.userId; // từ token
      const { title, dueDate, position } = req.body;
      const subtask = await SubtaskService.createSubtask(userId, todoId, { title, dueDate, position });
      res.status(201).json(subtask);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  getAll: async (req, res) => {
    try {
      const todoId = Number(req.params.todoId);
      const userId = req.userId;
      const subtasks = await SubtaskService.getSubtasks(userId, todoId);
      res.json(subtasks);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const userId = req.userId;
      const updated = await SubtaskService.updateSubtask(userId, id, req.body);
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  delete: async (req, res) => {
    try {
      const id = Number(req.params.id);
      const userId = req.userId;
      await SubtaskService.deleteSubtask(userId, id);
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

export default SubtaskController;
