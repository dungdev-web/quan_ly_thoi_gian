import UserService from '../services/authService.js';

const UserController = {
  register: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await UserService.register(username, password);
      res.status(201).json({ id: user.id, username: user.username });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const { user, token } = await UserService.login(username, password);
       res.cookie("token", token, {
        httpOnly: true,        
        secure: false,      
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000 
      });
      res.json({ id: user.id, username: user.username,success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  verify: (req, res) => {
    const token = req.cookies.token;
    const payload = UserService.verifyToken(token);
    if (payload) {
      res.json({ valid: true, userId: payload.userId, username: payload.username });
    } else {
      res.status(401).json({ valid: false, error: "Invalid token" });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { username, newPassword } = req.body;
      const updatedUser = await UserService.forgotPassword(username, newPassword);
      res.json({ id: updatedUser.id, username: updatedUser.username });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  logout: async (req, res) => {
    try {
     res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({ message: "Logout successful" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

export default UserController;