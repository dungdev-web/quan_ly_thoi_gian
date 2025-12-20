import React, { useState,useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../Tempo-removebg-preview.png";
import { logoutUser } from "../services/authService";
import { checkLogin } from "../services/authService";
export default function Aside() {
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const logout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await checkLogin();
        setUser(userData.user);
      } catch (err) {
        console.error("Check login failed", err);
      }
    };
    fetchUser();
  }, []);

  const handleGotoPage = () => {
    setActiveMenu("dashboard");
    navigate("/home");
  };

  const handleMainClick = (key) => {
    setActiveMenu((prev) => (prev === key ? null : key));
  };

  const gotoCreateArticle = () => {
    navigate("/create");
  };

  const gotoArchivedTasks = () => {
    setActiveMenu("archived");

    navigate("/archived");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="sidebar">
      {/* Logo Header */}
      <header>
        <img src={logo} alt="logo" />
      </header>

      <nav>
        <ul>
          {/* Dashboard */}
          <li>
            <button
              type="button"
              className={isActive("/home") ? "active" : ""}
              onClick={handleGotoPage}
            >
              <i className="fa-solid fa-chart-line"></i>
              <p>Dashboard</p>
            </button>
          </li>

          {/* Create */}
          <li>
            <button
              type="button"
              className={
                activeMenu === "create" || isActive("/create") ? "active" : ""
              }
              onClick={() => handleMainClick("create")}
            >
              <i className="fa-solid fa-plus-circle"></i>
              <p>Create</p>
              <i
                className={`fa-solid fa-chevron-down ${
                  activeMenu === "create" ? "rotate" : ""
                }`}
              ></i>
            </button>

            {/* Submenu */}
            <div
              className="sub-menu"
              style={{
                height: activeMenu === "create" ? "50px" : "0px",
              }}
            >
              <ul>
                <li>
                  <button
                    type="button"
                    onClick={gotoCreateArticle}
                    className={isActive("/create") ? "active" : ""}
                  >
                    <p>Create Task</p>
                  </button>
                </li>
              </ul>
            </div>
          </li>

          {/* Archived */}
          <li>
            <button
              type="button"
              className={isActive("/archived") ? "active" : ""}
              onClick={gotoArchivedTasks}
            >
              <i className="fa-solid fa-box-archive"></i>
              <p>Archived</p>
            </button>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <footer>
        <div className="user-section">
          <div className="user-info">
            <div className="user-avatar">U</div>
            <div className="user-details">
              <p className="user-name">{user?.username}</p>
              <p className="user-email">user@tempo.com</p>
            </div>
          </div>
          <button onClick={logout} className="logout-btn">
            <i className="fa-solid fa-right-from-bracket"></i>
            <p>Logout</p>
          </button>
        </div>
      </footer>
    </aside>
  );
}
