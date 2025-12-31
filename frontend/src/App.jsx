import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreateTask from "./pages/CreateTask";
import ListTask from "./pages/List";
import Loader from "./components/Loader";
import MainLayout from "./components/MainLayout";
import { isLoggedIn } from "./services/authService";
import { useState, useEffect } from "react";
// function PrivateRoute({ auth, children }) {
//   if (!auth) return <Navigate to="/login" replace />;
//   return children;
// }

function AppContent() {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const logged = await isLoggedIn();
      setAuth(logged);
      setLoading(false);
    };
    check();
  }, []);

  if (loading) return <Loader />;

  return (
    <Routes>
      {/* redirect root */}
      <Route path="/" element={<Navigate to="/home" />} />

      {/* public */}
      <Route path="/login" element={<Login setAuth={setAuth} />} />
      <Route path="/register" element={<Register />} />

      {/* private layout */}
      <Route
        element={
          auth ? <MainLayout /> : <Navigate to="/login" replace />
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/create" element={<CreateTask />} />
        <Route path="/archived" element={<ListTask />} />
      </Route>

      {/* catch all */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
