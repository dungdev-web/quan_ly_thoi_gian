import prisma from "../prisma/client.js";

const SubtaskRepository = {
  create: (data) => {
    return prisma.subtask.create({ 
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      } 
    });
  },
  findByTodoId: (todoId) => prisma.subtask.findMany({ where: { todoId } }),
  findById: (id) => prisma.subtask.findUnique({ where: { id } }),
  update: (id, data) => prisma.subtask.update({ where: { id }, data }),
  delete: (id) => prisma.subtask.delete({ where: { id } }),
};

export default SubtaskRepository;
