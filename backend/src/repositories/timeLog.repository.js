import prisma from "../prisma/client.js";

const TimeLogRepository = {
  findRunning(userId) {
    return prisma.timeLog.findFirst({
      where: { userId, endTime: null },
      include: { todo: true },
    });
  },

  start(userId, todoId) {
    return prisma.timeLog.create({
      data: {
        userId,
        todoId: todoId || null,
        startTime: new Date(),
      },
    });
  },

  stop(logId, duration) {
    return prisma.timeLog.update({
      where: { id: logId },
      data: {
        endTime: new Date(),
        duration,
      },
    });
  },
  getTodoStatus(todoId) {
    return prisma.todo.findUnique({
      where: { id: todoId },
      select: { id: true, status: true },
    });
  },
  getLogsInRange(userId, start, end) {
    return prisma.timeLog.findMany({
      where: {
        userId,
        endTime: { not: null },
        startTime: { gte: start, lte: end },
      },
    });
  },

  getTodayLogs(userId, start, end) {
    return prisma.timeLog.findMany({
      where: {
        userId,
        startTime: { gte: start, lte: end },
      },
      include: { todo: true },
      orderBy: { startTime: "asc" },
    });
  },

  getAllLogsWithCategory(userId) {
    return prisma.timeLog.findMany({
      where: { userId, endTime: { not: null } },
      include: {
        todo: { include: { category: true } },
      },
    });
  },

  countTasksDoneToday(userId, start, end) {
    return prisma.todo.count({
      where: {
        userId,
        status: "done",
        updatedAt: { gte: start, lte: end },
      },
    });
  },
  countTasksDoneThisWeek(userId, startWeek, endWeek) {
  return prisma.todo.count({
    where: {
      userId,
      status: "done",
      updatedAt: {
        gte: startWeek,
        lte: endWeek,
      },
    },
  });
}

};
export default TimeLogRepository;
