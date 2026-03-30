import { checkLogin } from "./authService"; //  Lấy danh sách todos (cookie tự gửi theo request)
const API_URL = process.env.REACT_APP_API_URL+"/api/todos";
export async function getTodos() {
  const { loggedIn, user } = await checkLogin();
  if (!loggedIn) throw new Error("Not logged in");

  const res = await fetch(`${API_URL}/user/${user.userId}`, {
    method: "GET",
    credentials: "include",
  });
  return res.json();
}
function normalizeDateTime(dt) {
  if (!dt) return null;
  // datetime-local = "2025-12-09T18:36"
  // cần thành      = "2025-12-09T18:36:00"
  if (dt.length === 16) return dt + ":00";
  return dt;
}

// Thêm todo mới
export async function addTodo(data) {
  const payload = {
    ...data,
    startTime: normalizeDateTime(data.startTime),
    endTime: normalizeDateTime(data.endTime),
    dueDate: data.dueDate, // date không cần sửa
  };

  console.log("📌 Payload gửi lên BACKEND:", payload);

  const res = await fetch(API_URL, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
}

//  Xóa todo
export async function deleteTodo(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    // Nếu server trả lỗi JSON (400, 401,...)
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete todo");
  }

  // DELETE thành công, không có body JSON
  return { success: true };
}

export async function updatePosition(id, newPosition) {
  const res = await fetch(`${API_URL}/${id}/position`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ position: newPosition }),
    credentials: "include",
  });
  return res.json();
}
export async function update(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data), //  ĐÚNG
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Update failed");
  }

  return res.json();
}


export async function getArchivedTodos() {
  const { loggedIn, user } = await checkLogin();
  if (!loggedIn) throw new Error("Not logged in");
  const res = await fetch(`${API_URL}/user/archived/${user.userId}`, {
    method: "GET",
    credentials: "include",
  });
  return res.json();
}
export async function setArchivedTodo(id, archived) {
  const res = await fetch(`${API_URL}/archive/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ archived }),
    credentials: "include",
  });
  return res.json();
}
