import jwt from "jsonwebtoken";


export const protect = (req, res, next) => {
  // Lấy token từ cookie
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lưu userId vào req.userId
    req.userId = decoded.userId;

    next(); // tiếp tục middleware/route
  } catch (err) {
    console.error("JWT error:", err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};
