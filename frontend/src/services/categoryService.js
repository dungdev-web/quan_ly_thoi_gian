const API_URL = process.env.REACT_APP_API_URL + "/api/categories";

export async function getCategoriesByUser() {
  const res = await fetch(`${API_URL}/user`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Không thể lấy danh mục");
  return res.json();
}

export async function createCategory(name) {
  const res = await fetch(API_URL, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Không thể tạo danh mục");
  return res.json();
}