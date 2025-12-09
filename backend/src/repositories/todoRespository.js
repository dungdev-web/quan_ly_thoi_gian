import prisma from "../prisma/client.js";
const TodoRepository = {
  createTodo: (userId, data) => {
  return prisma.todo.create({
    data: {
      ...data,
      userId,
      startTime: data.startTime ? new Date(data.startTime) : null,
      endTime: data.endTime ? new Date(data.endTime) : null,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
    },
  });
},


  findAllByUser: (userId) =>
    prisma.todo.findMany({
      where: { userId },
      include: { subtasks: true, category: true },
      orderBy: { position: "asc" },
    }),

  findById: (id) =>
    prisma.todo.findUnique({
      where: { id },
      include: { subtasks: true, category: true },
    }),

  update: (id, data) =>
    prisma.todo.update({
      where: { id },
      data,
    }),

   delete: async (id) => {
    const todo = await prisma.todo.findUnique({
      where: { id },
      include: { subtasks: true },
    });

    if (!todo) {
      throw new Error("Todo not found");
    }

    if (todo.subtasks.length > 0) {
      throw new Error("Cannot delete todo with existing subtasks");
    }

    return prisma.todo.delete({ where: { id } });
  },

  updatePosition: (id, position) =>
    prisma.todo.update({
      where: { id },
      data: { position },
    }),
};

export default TodoRepository;