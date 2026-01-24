# 📝 Todo App

Ứng dụng quản lý công việc hiện đại được xây dựng với React, Node.js và Material-UI, giúp bạn tổ chức các task hàng ngày một cách hiệu quả và chuyên nghiệp.

![Todo App Demo](https://cv-five-beige.vercel.app/todo.png)

## ✨ Tính năng

- ➕ Thêm công việc mới với giao diện Material-UI
- ✅ Đánh dấu hoàn thành/chưa hoàn thành
- ✏️ Chỉnh sửa nội dung công việc
- 🗑️ Xóa công việc không cần thiết
- 📊 Thống kê tiến độ công việc
- 💾 Lưu trữ dữ liệu với backend API
- 📱 Responsive design, tương thích mọi thiết bị
- 🎨 Giao diện đẹp mắt với Material-UI components
- ⚡ Hiệu năng cao với React hooks và optimization

## 🚀 Demo

[Xem demo trực tiếp tại đây](https://quan-ly-thoi-gian.vercel.app/)

## 🛠️ Công nghệ sử dụng

### Frontend
- **React** (v18+) - UI Library
- **Material-UI (MUI)** (v5+) - Component Library
- **React Router** - Điều hướng
- **Fetch** - HTTP Client
- **React Hooks** - State Management

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MySQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication

## 📦 Cài đặt

### Yêu cầu hệ thống

- Node.js (v14 trở lên)
- npm
- MySQL

### Các bước cài đặt

1. Clone repository về máy:
```bash
git clone https://github.com/username/todo-app.git
cd todo-app
```

2. Cài đặt dependencies cho Backend:
```bash
cd backend
npm install
```

3. Cài đặt dependencies cho Frontend:
```bash
cd ../frontend
npm install
```

4. Cấu hình biến môi trường:

**Backend** - Tạo file `.env` trong thư mục `backend`:
```env
PORT=5000
DATABASE_URL=mysql://root:@localhost:3306/todoapp
JWT_SECRET=your_secret_key
```

**Frontend** - Tạo file `.env` trong thư mục `frontend`:
```env
REACT_APP_API_URL=http://localhost:5000
```

5. Chạy ứng dụng:

**Backend**:
```bash
cd backend
npm start
# hoặc npm run dev (nếu dùng nodemon)
```

**Frontend**:
```bash
cd frontend
npm start
```

Ứng dụng sẽ chạy tại:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## 📁 Cấu trúc thư mục

```
todo-app/
│
├── frontend/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # React Components
│   │   ├── pages/           # Pages/Views
│   │   ├── services/        # API services
│   │   ├── validators/      # Validate login, register
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env
│
├── backend/                  # Node.js Backend
│   ├── src/
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route controllers
│   │   ├── middlewares/     # Middlewares
│   │   ├── config/          # Configuration files
│   │   └── server.js        # Entry point
│   ├── package.json
│   └── .env
│
└── README.md
```

## 🔌 API Endpoints

### Todos
- `GET /api/todos` - Lấy tất cả todos
- `POST /api/todos` - Tạo todo mới
- `GET /api/todos/:id` - Lấy todo theo ID
- `PUT /api/todos/:id` - Cập nhật todo
- `DELETE /api/todos/:id` - Xóa todo

## 💻 Sử dụng

1. **Thêm công việc mới**: Click vào nút "+" hoặc "Add Task", nhập nội dung và nhấn Enter
2. **Đánh dấu hoàn thành**: Click vào checkbox bên cạnh công việc
3. **Chỉnh sửa**: Click vào icon edit để sửa nội dung
4. **Xóa công việc**: Click vào icon delete
5. **Lọc công việc**: Sử dụng tabs hoặc dropdown để lọc theo trạng thái
6. **Tìm kiếm**: Sử dụng thanh search để tìm kiếm công việc

## 🚀 Scripts

### Frontend
```bash
npm start          # Chạy development server
npm run build      # Build production
npm test           # Chạy tests
npm run eject      # Eject từ Create React App
```

### Backend
```bash
npm start          # Chạy server
npm run dev        # Chạy với nodemon
```

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Để đóng góp:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 🐛 Báo lỗi

Nếu bạn phát hiện lỗi, vui lòng tạo issue mới với:
- Mô tả chi tiết lỗi
- Các bước tái hiện lỗi
- Screenshots (nếu có)
  
- Môi trường (OS, Browser, Node version)

## 📝 License

Project này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

