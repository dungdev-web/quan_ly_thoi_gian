   # TempoTask: Time & Task Management Platform

[![GitHub language](https://img.shields.io/github/languages/top/dungdev-web/quan_ly_thoi_gian?style=for-the-badge&color=blueviolet)](https://github.com/dungdev-web/quan_ly_thoi_gian)
[![GitHub Stars](https://img.shields.io/github/stars/dungdev-web/quan_ly_thoi_gian?style=for-the-badge&color=gold)](https://github.com/dungdev-web/quan_ly_thoi_gian/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/dungdev-web/quan_ly_thoi_gian?style=for-the-badge&color=teal)](https://github.com/dungdev-web/quan_ly_thoi_gian/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/dungdev-web/quan_ly_thoi_gian?style=for-the-badge&color=red)](https://github.com/dungdev-web/quan_ly_thoi_gian/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**TempoTask** is a modern and efficient full-stack web application designed to help you organize your daily tasks, manage subtasks, and track your time effectively. Built with a robust **React** frontend and a powerful **Node.js/Express** backend, it provides a seamless and intuitive experience for personal productivity and professional task management.

---

## Live Demo

Experience TempoTask in action:
[**quan-ly-thoi-gian.vercel.app**](https://quan-ly-thoi-gian.vercel.app/)

![TempoTask Demo](https://cv-five-beige.vercel.app/todo.png)

---

## Table of Contents

*   [Live Demo](#-live-demo)
*   [Table of Contents](#-table-of-contents)
*   [About TempoTask](#-about-tempotask)
    *   [Problem It Solves](#problem-it-solves)
    *   [Key Features](#key-features)
    *   [Use Cases](#use-cases)
*   [Technologies Used](#-technologies-used)
    *   [Frontend](#frontend)
    *   [Backend](#backend)
    *   [Database](#database)
*   [Getting Started](#-getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
    *   [Database Setup](#database-setup)
    *   [Environment Variables](#environment-variables)
    *   [Running the Application](#running-the-application)
*   [Project Structure](#-project-structure)
*   [API Endpoints](#-api-endpoints)
    *   [Authentication](#authentication)
    *   [Tasks (Todos)](#tasks-todos)
    *   [Subtasks](#subtasks)
    *   [Time Logs](#time-logs)
*   [How to use](#-how-to-use)
*   [License](#-license)
*   [Acknowledgments](#-acknowledgments)

---

## About TempoTask

TempoTask (originally named "Quản Lý Thời Gian" - Time Management) is a comprehensive task and time management solution. It's designed to streamline your workflow, ensure no task is left behind, and provide insights into how you spend your time.

### Problem It Solves

In today's fast-paced world, managing multiple tasks, deadlines, and personal goals can be overwhelming. TempoTask addresses this by offering a centralized platform to:
*   Organize tasks with subtasks for granular control.
*   Track time spent on each activity, fostering better time awareness.
*   Visualize progress and stay motivated.
*   Provide a responsive and intuitive interface across devices.

### Key Features

TempoTask comes packed with features to boost your productivity:

*   **User Authentication**: Secure user registration and login with JWT-based authentication.
*   **Task Management**:
    * Create, view, update, and delete main tasks (todos).
    * Mark tasks as completed/incomplete.
    * Edit task content and details.
*   **Subtask Support**: Break down complex tasks into smaller, manageable subtasks for better organization.
*   **Time Logging**: Track the time spent on individual tasks and subtasks for detailed time analysis.
*   **Progress Statistics**: View overall progress and completion rates for your tasks.
*   **Intuitive UI**: A beautiful, responsive interface built with Material-UI components for a smooth user experience.
*   **Persistent Data**: All data is securely stored and managed via a backend API and MySQL database.
*   **Responsive Design**: Enjoy a consistent experience across desktops, tablets, and mobile devices.

### Use Cases

*   **Personal Productivity**: Manage your daily chores, learning goals, and personal projects.
*   **Student Life**: Keep track of assignments, study sessions, and project deadlines.
*   **Freelancers/Professionals**: Organize client tasks, track billable hours, and manage project milestones.
*   **Small Teams**: Coordinate tasks and track team progress (though designed primarily for individual use, its structure supports future team features).

---

## Technologies Used

TempoTask leverages a modern full-stack architecture to deliver a robust and scalable application.

### Frontend
*   **React (v18+)**: A declarative, component-based JavaScript library for building user interfaces.
*   **Material-UI (MUI v5+)**: A comprehensive suite of UI tools and components for a beautiful and consistent design.
*   **React Router**: For declarative routing and navigation within the application.
*   **Fetch API**: For making HTTP requests to the backend.
*   **React Hooks**: For state management and lifecycle methods in functional components.
*   **Yup & Formik**: For robust form validation (inferred from `validators` directory).
*   **Tailwind CSS**: (Potentially used alongside MUI, as indicated by `tailwind.config.js`) For utility-first CSS styling.

### Backend
*   **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
*   **Express.js (v5+)**: A fast, unopinionated, minimalist web framework for Node.js.
*   **JSON Web Tokens (JWT)**: For secure user authentication and authorization.
*   **Bcrypt**: For hashing user passwords securely.
*   **Cookie-Parser**: Middleware for parsing cookies.
*   **CORS**: For enabling cross-origin resource sharing.
*   **date-fns**: A comprehensive and consistent toolset for manipulating JavaScript dates.
*   **Nodemon**: A utility that monitors for any changes in your source and automatically restarts your server.

### Database
*   **MySQL**: A popular open-source relational database management system.
*   **Prisma (v6+)**: A next-generation ORM (Object-Relational Mapper) that makes database access easy and type-safe.

---

## Getting Started

Follow these instructions to set up and run TempoTask on your local machine.

### Prerequisites

Ensure you have the following installed on your system:

*   **Node.js**: (v14 or higher) - [Download & Install Node.js](https://nodejs.org/en/download/)
*   **npm**: (Comes with Node.js) - Node Package Manager
*   **MySQL Server**: [Download & Install MySQL](https://dev.mysql.com/downloads/mysql/)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/dungdev-web/quan_ly_thoi_gian.git
    cd quan_ly_thoi_gian
    ```

2.  **Install Backend dependencies**:
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend dependencies**:
    ```bash
    cd ../frontend
    npm install
    ```

### Database Setup

TempoTask uses Prisma for database management.

1.  **Configure your MySQL database**:
    *   Ensure your MySQL server is running.
    *   Create a new database for the application, e.g., `todoapp`.

2.  **Apply Prisma migrations**:
    ```bash
    cd backend
    npx prisma migrate dev --name init # This will apply any pending migrations
    ```
    *   *Note*: If you encounter issues, ensure your `DATABASE_URL` in `.env` is correctly pointing to your MySQL instance and the database `todoapp` exists.

### Environment Variables

You need to create `.env` files in both the `backend` and `frontend` directories to configure the application.

1.  **Backend Configuration**
    Create a file named `.env` in the `backend/` directory with the following content:

    ```env
    # Server Port
    PORT=5000

    # Database Connection String
    # Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
    # Example for local MySQL with no password and 'todoapp' database:
    DATABASE_URL="mysql://root:@localhost:3306/todoapp"

    # JWT Secret for authentication (generate a strong, random string)
    JWT_SECRET="your_very_secret_jwt_key_here"
    ```

2.  **Frontend Configuration**
    Create a file named `.env` in the `frontend/` directory with the following content:

    ```env
    # API URL for the backend server
    REACT_APP_API_URL=http://localhost:5000
    ```

### Running the Application

1.  **Start the Backend server**:
    Open a new terminal, navigate to the `backend` directory, and run:

    ```bash
    cd backend
    npm run dev
    # Or for production: npm start
    ```
    The backend server will start at `http://localhost:5000`.

2.  **Start the Frontend development server**:
    Open another new terminal, navigate to the `frontend` directory, and run:

    ```bash
    cd frontend
    npm start
    ```
    The frontend application will open in your browser at `http://localhost:3000`.

You are now ready to use TempoTask!

---

## Project Structure

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

##  API Endpoints

### Todos
- `GET /api/todos/user/:userId` - Lấy tất cả todos theo user
- `POST /api/todos` - Tạo todo mới
- `GET /api/todos/:id` - Lấy todo theo ID
- `PUT /api/todos/:id` - Cập nhật todo
- `DELETE /api/todos/:id` - Xóa todo

##  How to use

1. **Thêm công việc mới**: Click vào nút "+" hoặc "Add Task", nhập nội dung và nhấn Enter
2. **Đánh dấu hoàn thành**: Click vào checkbox bên cạnh công việc
3. **Chỉnh sửa**: Click vào icon edit để sửa nội dung
4. **Xóa công việc**: Click vào icon delete

##  Scripts

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
