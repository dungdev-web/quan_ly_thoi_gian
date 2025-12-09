const API_URL = "http://localhost:5000/api/time-logs";
export async function getTodayLog() {
  const response = await fetch(`${API_URL}/today`, {
    method: "GET",
    credentials: "include", // Gửi kèm cookie
    headers: {
      "Content-Type": "application/json",
    },
  });
    if (!response.ok) {
    throw new Error("Failed to fetch today's time log");
  }
    return response.json();
}
export async function getOverview() {
    const response = await fetch(`${API_URL}/overview`, {
    method: "GET",
    credentials: "include", // Gửi kèm cookie
    headers: {
        "Content-Type": "application/json",
    },
    });
    if (!response.ok) {
    throw new Error("Failed to fetch time log overview");
    }
    return response.json();
}
export async function getChartData() {
    const response = await fetch(`${API_URL}/chart-7-days`, {
    method: "GET",
    credentials: "include", // Gửi kèm cookie
    headers: {
        "Content-Type": "application/json",
    },
    });
    if (!response.ok) {
    throw new Error("Failed to fetch chart data for the last 7 days");
    }
    return response.json();
}