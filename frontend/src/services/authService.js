const API_URL = "http://localhost:5000/api/auth";

// 🔐 Đăng ký người dùng
export async function registerUser(username, password) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

// 🔑 Đăng nhập người dùng
export async function loginUser(username, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}



// 🧭 Lấy token hiện tại
export async function checkLogin() {
  const res = await fetch(`${API_URL}/verify`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) return { loggedIn: false };

  const data = await res.json(); // { valid: true, userId: 2 }

  return {
    loggedIn: data.valid,
    user: { userId: data.userId, username: data.username},
  };
}


// 🧠 Kiểm tra đã đăng nhập chưa
export async function isLoggedIn() {
  const result = await checkLogin();
  console.log("VERIFY RESULT FRONTEND:", result);
  return result.loggedIn === true;
}

