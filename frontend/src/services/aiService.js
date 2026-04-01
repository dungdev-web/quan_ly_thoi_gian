const API_URL = process.env.REACT_APP_API_URL + "/api/ai";

export async function suggestSubtasks(title, description = "") {
  const res = await fetch(`${API_URL}/suggest-subtasks`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
  if (!res.ok) throw new Error("Không thể gợi ý subtask");
  return res.json();
}

export async function analyzeTimeHabits(timeLogs) {
  const res = await fetch(`${API_URL}/analyze-time`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ timeLogs }),
  });
  if (!res.ok) throw new Error("Không thể phân tích thời gian");
  return res.json();
}

export async function prioritizeTodos(todos) {
  const res = await fetch(`${API_URL}/prioritize`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ todos }),
  });
  if (!res.ok) throw new Error("Không thể ưu tiên task");
  return res.json();
}

export async function chatWithAI(message, context = "",history = []) {
  const res = await fetch(`${API_URL}/chat`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, context, history  }),
  });
  if (!res.ok) throw new Error("Không thể kết nối AI");
  return res.json();
}   
// ── THÊM vào frontend/src/services/aiService.js ──

export async function analyzeProductivity() {
  const res = await fetch(
    `${process.env.REACT_APP_API_URL}/api/ai/analyze-productivity`,
    { method: "GET", credentials: "include" }
  );
  if (!res.ok) throw new Error("Không thể phân tích năng suất");
  return res.json();
}