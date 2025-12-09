import TimeLogRepository from "../repositories/timeLog.repository.js";
import {
  startOfDay,
  endOfDay,
  subDays,
  format,
  startOfWeek,
  endOfWeek,
  addDays,
} from "date-fns";

const TimeLogService = {
  startLog: async (userId, todoId) => {
    const running = await TimeLogRepository.findRunning(userId);
    if (running) throw new Error("Bạn đang chạy một tác vụ rồi!");

    if (todoId) {
      const todo = await TimeLogRepository.getTodoStatus(todoId);

      if (!todo) {
        throw new Error("Tác vụ không tồn tại!");
      }

      if (todo.status === "done") {
        throw new Error("Không thể bắt đầu tác vụ đã hoàn thành!");
      }
    }

    return await TimeLogRepository.start(userId, todoId);
  },

  stopLog: async (userId) => {
    const running = await TimeLogRepository.findRunning(userId);

    if (!running) throw new Error("Không có tác vụ đang chạy!");

    const end = new Date();
    const duration = Math.floor((end - running.startTime) / 1000 / 60);

    return await TimeLogRepository.stop(running.id, duration);
  },

  getRunning: async (userId) => {
    return await TimeLogRepository.findRunning(userId);
  },
  dashboardOverview: async (userId) => {
    const now = new Date();
    const day = now.getDay();

    // ======= TODAY =======
    const start = startOfDay(now);
    const end = endOfDay(now);

    const logsToday = await TimeLogRepository.getLogsInRange(
      userId,
      start,
      end
    );
    const todayMinutes = logsToday.reduce(
      (sum, log) => sum + (log.duration || 0),
      0
    );

    // ======= THIS WEEK =======
    let totalMinutesWeek = 0;
    const diffToMonday = day === 0 ? 6 : day - 1;

    const monday = subDays(startOfDay(now), diffToMonday);
    // const sunday = addDays(monday, 6);
    for (let i = 0; i < 7; i++) {
      const day = addDays(monday, i);
      const start = startOfDay(day);
      const end = endOfDay(day);

      const logs = await TimeLogRepository.getLogsInRange(userId, start, end);
      const minutes = logs.reduce((s, l) => s + (l.duration || 0), 0);

      totalMinutesWeek += minutes;
    }

    const totalWeekHours = (totalMinutesWeek / 60).toFixed(2);

    // ======= TASKS DONE TODAY =======
    const tasksDone = await TimeLogRepository.countTasksDoneToday(
      userId,
      start,
      end
    );
    // ======= TASKS DONE THIS WEEK =======
    const startWeek = startOfDay(subDays(now, 6));
    const endWeek = endOfDay(now);

    const focusSessions = await TimeLogRepository.countTasksDoneThisWeek(
      userId,
      startWeek,
      endWeek
    );
    // ======= RUNNING TASK =======
    const running = await TimeLogRepository.findRunning(userId);

    return {
      todayMinutes,
      totalWeekMinutes: totalMinutesWeek,
      totalWeekHours,
      tasksDone,
      focusSessions,
      runningTask: running || null,
    };
  },

  getLast7Days: async (userId) => {
    const now = new Date();

    // --- Xác định thứ trong tuần (0=CN, 1=Thứ 2, ...)
    const day = now.getDay();

    // --- Tìm ngày THỨ 2 gần nhất
    const diffToMonday = day === 0 ? 6 : day - 1;

    const monday = subDays(startOfDay(now), diffToMonday);
    const sunday = addDays(monday, 6);

    let result = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(monday, i);
      const start = startOfDay(day);
      const end = endOfDay(day);

      const logs = await TimeLogRepository.getLogsInRange(userId, start, end);
      const minutes = logs.reduce((s, l) => s + (l.duration || 0), 0);

      result.push({
        date: format(day, "yyyy-MM-dd"),
        minutes,
      });
    }

    return { startWeek: monday, endWeek: sunday, result };
  },

  categoryStats: async (userId) => {
    const logs = await TimeLogRepository.getAllLogsWithCategory(userId);

    let stats = {};

    logs.forEach((log) => {
      const cat = log.todo?.category?.name || "Uncategorized";
      if (!stats[cat]) stats[cat] = 0;
      stats[cat] += log.duration || 0;
    });

    return Object.entries(stats).map(([category, minutes]) => ({
      category,
      minutes,
    }));
  },

  todayLogs: async (userId) => {
    const start = startOfDay(new Date());
    const end = endOfDay(new Date());

    // lấy toàn bộ logs hôm nay
    const logs = await TimeLogRepository.getTodayLogs(userId, start, end);

    // tính tổng phút
    const totalMinutes = logs.reduce(
      (sum, log) => sum + (log.duration || 0),
      0
    );

    // đổi sang hh:mm
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    const totalHours = `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}`;

    return {
      logs,
      totalMinutes,
      totalHours,
    };
  },
};
export default TimeLogService;
