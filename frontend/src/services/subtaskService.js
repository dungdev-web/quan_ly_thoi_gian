const API_URL = process.env.REACT_APP_API_URL+"/api/subtasks";
export async function createSubtask(todoId, subtaskData) {
  const response = await fetch(`${API_URL}/sub/${todoId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subtaskData),
    credentials: "include",
  });
    return response.json();
}
export async function deleteSubtask(subtaskId) {
  const response = await fetch(`${API_URL}/${subtaskId}`, {
    method: "DELETE",
    credentials: "include",
  });
  return response.json();
}