import prisma from "../prisma/client.js";

const SubtaskRepository = {
  create: (data) => prisma.subtask.create({ data }),
  findByTodoId: (todoId) => prisma.subtask.findMany({ where: { todoId } }),
  findById: (id) => prisma.subtask.findUnique({ where: { id } }),
  update: (id, data) => prisma.subtask.update({ where: { id }, data }),
  delete: (id) => prisma.subtask.delete({ where: { id } }),
};

export default SubtaskRepository;
