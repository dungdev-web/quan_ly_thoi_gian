import AiService from "../services/aiService.js";
import TimeLogService from "../services/timeLog.service.js";
import TodoService from "../services/todoService.js";
import SubtaskService from "../services/subtaskService.js";
const AiController = {
  suggestSubtasks: async (req, res) => {
    try {
      const { title, description } = req.body;
      const subtasks = await AiService.suggestSubtasks(title, description);
      res.json({ subtasks });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  analyzeTimeHabits: async (req, res) => {
    try {
      const { timeLogs } = req.body;
      const analysis = await AiService.analyzeTimeHabits(timeLogs);
      res.json(analysis);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  prioritizeTodos: async (req, res) => {
    try {
      const { todos } = req.body;
      const result = await AiService.prioritizeTodos(todos);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  // ── THÊM vào aiController.js ──
  analyzeProductivity: async (req, res) => {
    try {
      const userId = req.userId;

      // Gọi song song 4 API để lấy đủ data
      const [overview, last7DaysData, categoryStats, todayLogs] =
        await Promise.all([
          TimeLogService.dashboardOverview(userId),
          TimeLogService.getLast7Days(userId),
          TimeLogService.categoryStats(userId),
          TimeLogService.todayLogs(userId),
        ]);

      const analysis = await AiService.analyzeProductivity({
        overview,
        last7Days: last7DaysData.result,
        categoryStats,
        todayLogs,
      });

      res.json(analysis);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  chat: async (req, res) => {
    console.log("📩 Nhận request chat:", req.body);
    try {
      const { message, context, history = [] } = req.body;
      const userId = req.userId;

      console.log("Đang gọi Groq...");
      const result = await AiService.chat(message, context, history);
      console.log("Groq trả về:", result);

      if (result.action?.type === "CREATE_TASK") {
        try {
          // 1. Tạo todo — dùng đúng method createTodo(userId, data)
          const newTodo = await TodoService.createTodo(
            userId,
            result.action.task,
          );

          // 2. Tạo subtasks song song
          const suggestResult = await AiService.suggestSubtasks(
            result.action.task.title,
            result.action.task.description,
          );
          const subtasks = suggestResult.subtasks ?? suggestResult;

          const createdSubtasks = await Promise.all(
            subtasks.map((s) =>
              SubtaskService.createSubtask(userId, newTodo.id, {
                title: s.title,
                // estimatedMinutes: s.estimatedMinutes ?? 30,
                // status: "todo",
              }),
            ),
          );

          result.createdTodo = { ...newTodo, subtasks: createdSubtasks };
          console.log("✅ Tạo todo + subtasks thành công:", newTodo.id);
        } catch (todoErr) {
          console.error("❌ Lỗi tạo todo/subtask:", todoErr.message);
          result.error = "Không thể tạo task tự động";
        }
      }
      // ── DELETE TASK ──
      if (result.action?.type === "DELETE_TASK") {
        const taskIds = result.action.taskIds ?? [];
        const deleted = [];
        const failed = [];

        await Promise.all(
          taskIds.map(async (id) => {
            try {
              // Xóa subtasks trước (vì TodoRepository.delete không cho xóa nếu có subtasks)
              const todo = await TodoService.getTodoById(id);
              if (!todo || todo.userId !== userId) {
                failed.push(id);
                return;
              }

              await Promise.all(
                todo.subtasks.map((s) =>
                  SubtaskService.deleteSubtask(userId, s.id),
                ),
              );

              await TodoService.deleteTodo(id);
              deleted.push(id);
            } catch (err) {
              console.warn(`⚠️ Không xóa được task ${id}:`, err.message);
              failed.push(id);
            }
          }),
        );

        result.deletedIds = deleted;
        result.failedIds = failed;
        console.log("✅ Đã xóa tasks:", deleted, "| Thất bại:", failed);
      }
      res.json(result);
    } catch (err) {
      console.error("❌ Lỗi chat:", err.message);
      res.status(500).json({ error: err.message });
    }
  },
};

export default AiController;
