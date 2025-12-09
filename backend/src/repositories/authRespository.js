import prisma from "../prisma/client.js";

const UserRepository = {
  create: (data) => prisma.user.create({ data }),
  findByUsername: (username) => prisma.user.findUnique({ where: { username } }),
  findById: (id) => prisma.user.findUnique({ where: { id } }),
};

export default UserRepository;
