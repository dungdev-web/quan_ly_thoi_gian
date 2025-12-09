import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { isLoggedIn } from "./services/authService";
import { useState, useEffect } from "react";
import Loader from "./components/Loader";
import Aside from "./components/Aside";
import CreateTask from "./pages/CreateTask";

function PrivateRoute({ children, auth }) {
  if (!auth) return <Navigate to="/login" replace />;
  return children;
}

function AppContent() {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const check = async () => {
      const logged = await isLoggedIn();
      setAuth(logged);
      setLoading(false);
    };
    check();
  }, []);

  if (loading) return <Loader />;

  const hideSidebar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideSidebar && auth && <Aside />}

      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />

        {/* public routes */}
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/register" element={<Register />} />

        {/* private routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute auth={auth}>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/create"
          element={
            <PrivateRoute auth={auth}>
              <CreateTask />
            </PrivateRoute>
          }
        />

        {/* catch all → login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
