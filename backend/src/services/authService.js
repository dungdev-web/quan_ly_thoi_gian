import UserRepository from "../repositories/authRespository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

const UserService = {
  register: async (username, password) => {
    const existingUser = await UserRepository.findByUsername(username);
    if (existingUser) throw new Error("Username already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserRepository.create({ username, password: hashedPassword });
    return user;
  },

  login: async (username, password) => {
    const user = await UserRepository.findByUsername(username);
    if (!user) throw new Error("Invalid username or password");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid username or password");

    const token = jwt.sign({ userId: user.id,username:user.username }, JWT_SECRET, { expiresIn: "1d" });
    return { user, token };
  },

  verifyToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  },
  forgotPassword: async (username, newPassword) => {
    const user = await UserRepository.findByUsername(username);
    if (!user) throw new Error("User not found");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await UserRepository.updatePassword(user.id, hashedPassword);
    return updatedUser;
  }
};

export default UserService;