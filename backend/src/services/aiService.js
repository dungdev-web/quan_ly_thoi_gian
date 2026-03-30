import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const callJSON = async (prompt) => {
  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "Bạn chỉ trả về JSON thuần túy, không markdown, không giải thích.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    response_format: { type: "json_object" },
  });
  return JSON.parse(res.choices[0].message.content);
};

const callText = async (systemPrompt, userMessage) => {
  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature: 0.7,
  });
  return res.choices[0].message.content;
};

const AiService = {
  suggestSubtasks: async (taskTitle, taskDescription = "") => {
    const result = await callJSON(
      `Tạo 3-5 subtask cụ thể cho công việc:
Tên: "${taskTitle}"
Mô tả: "${taskDescription}"

Trả về JSON: {"subtasks": [{"title": "tên subtask", "estimatedMinutes": 30}]}`
    );
    return result.subtasks ?? result;
  },

  analyzeTimeHabits: async (timeLogs) => {
    return await callJSON(
      `Phân tích năng suất từ time log: ${JSON.stringify(timeLogs)}

Trả về JSON:
{"summary":"tóm tắt 1 câu","insights":["nhận xét 1","nhận xét 2","nhận xét 3"],"suggestion":"lời khuyên"}`
    );
  },

  prioritizeTodos: async (todos) => {
    return await callJSON(
      `Sắp xếp ưu tiên các công việc: ${JSON.stringify(todos)}

Trả về JSON:
{"prioritized":[{"id":1,"priority":1,"reason":"lý do ngắn"}],"tip":"lời khuyên hôm nay"}`
    );
  },
// ── THÊM method này vào AiService object trong aiService.js hiện tại ──

analyzeProductivity: async ({ overview, last7Days, categoryStats, todayLogs }) => {
  return await callJSON(
    `Bạn là chuyên gia phân tích năng suất làm việc. Phân tích dữ liệu sau và đưa ra báo cáo chi tiết.

DỮ LIỆU:
- Tổng quan hôm nay: ${JSON.stringify(overview)}
- Thời gian làm việc 7 ngày qua (phút/ngày): ${JSON.stringify(last7Days)}
- Thống kê theo danh mục (phút): ${JSON.stringify(categoryStats)}
- Logs hôm nay: ${JSON.stringify(todayLogs?.logs?.slice(0, 10))}

Trả về JSON với cấu trúc:
{
  "score": 85,
  "grade": "B+",
  "summary": "Tóm tắt tổng quan 1-2 câu về năng suất",
  "highlights": [
    {"type": "positive", "text": "điểm mạnh cụ thể"},
    {"type": "positive", "text": "điểm mạnh cụ thể"},
    {"type": "warning", "text": "điểm cần cải thiện"},
    {"type": "warning", "text": "điểm cần cải thiện"}
  ],
  "peakDay": "Thứ 3",
  "peakMinutes": 180,
  "worstDay": "Thứ 7",
  "worstMinutes": 20,
  "topCategory": "tên danh mục làm nhiều nhất",
  "suggestions": [
    "gợi ý cải thiện cụ thể 1",
    "gợi ý cải thiện cụ thể 2",
    "gợi ý cải thiện cụ thể 3"
  ],
  "weekTrend": "up",
  "focusQuality": "good"
}`
  );
},
  chat: async (message, context = "") => {
    return await callText(
      `Bạn là TempoAI - trợ lý quản lý công việc thông minh. Trả lời ngắn gọn bằng tiếng Việt.${
        context ? `\nThông tin user: ${context}` : ""
      }`,
      message
    );
  },
};

export default AiService;