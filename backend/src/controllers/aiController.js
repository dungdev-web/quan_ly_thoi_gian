import AiService from "../services/aiService.js";
import TimeLogService from "../services/timeLog.service.js";

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
    const [overview, last7DaysData, categoryStats, todayLogs] = await Promise.all([
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
    try {
      const { message, context } = req.body;
      const reply = await AiService.chat(message, context);
      res.json({ reply });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};

export default AiController;