import  TimeLogService  from "../services/timeLog.service.js";

const TimeLogController = {
  start: async(req, res) => {
    try {
      const result = await TimeLogService.startLog(req.userId, req.body.todoId);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  stop: async(req, res) => {
    try {
      const result = await TimeLogService.stopLog(req.userId);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  running: async(req, res) => {
    const result = await TimeLogService.getRunning(req.userId);
    res.json(result);
  },

  overview: async(req, res) => {
    const data = await TimeLogService.dashboardOverview(req.userId);
    res.json(data);
  },

  last7Days: async(req, res) => {
    const data = await TimeLogService.getLast7Days(req.userId);
    res.json(data);
  },

  categoryStats: async(req, res) => {
    const data = await TimeLogService.categoryStats(req.userId);
    res.json(data);
  },

  today: async(req, res) => {
    const data = await TimeLogService.todayLogs(req.userId);
    res.json(data);
  },
};
export default TimeLogController;
