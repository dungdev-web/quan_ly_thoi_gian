const API_URL = process.env.REACT_APP_API_URL+"/time-logs";
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
export async function SartLog(todoId) {
  const response = await fetch(`${API_URL}/start`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ todoId }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to start time log");
  }

  return response.json();
}
export async function getRunningLog() {
    const response = await fetch(`${API_URL}/running`, {
    method: "GET",
    credentials: "include", // Gửi kèm cookie
    headers: {
        "Content-Type": "application/json",
    },
    });
    if (!response.ok) {
    throw new Error("Failed to fetch running time log");
    }
    return response.json();;
}
export async function StopLog() {
    const response = await fetch(`${API_URL}/stop`, {
    method: "POST",
    credentials: "include", // Gửi kèm cookie
    headers: {
        "Content-Type": "application/json",
    },
    });
    if (!response.ok) {
    throw new Error("Failed to stop time log");
    }
    return response.json();;
}