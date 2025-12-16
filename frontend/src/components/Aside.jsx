import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../Tempo-removebg-preview.png";

export default function Aside() {
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();

  const handleGotoPage = () => {
    setActiveMenu("dashboard");
    navigate("/home"); // 🔥 chuyển đến /home
  };

  const handleMainClick = (key) => {
    setActiveMenu((prev) => (prev === key ? null : key));
  };

  const gotoCreateArticle = () => {
    navigate("/create"); // 🔥 chuyển đến /create
  };

  const gotoArchivedTasks = () => {
    setActiveMenu("archived");

    navigate("/archived"); // 🔥 chuyển đến /archived
  };
  return (
    <aside className="sidebar">
      <header>
        <img src={logo} alt="logo" />
      </header>

      <ul>
        {/* Dashboard */}
        <li>
          <button
            type="button"
            className={activeMenu === "dashboard" ? "active" : ""}
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
            className={activeMenu === "create" ? "active" : ""}
            onClick={() => handleMainClick("create")}
          >
            <i className="fa-solid fa-arrow-up-right-from-square"></i>
            <p>Create</p>
            <i className="ai-chevron-down-small"></i>
          </button>

          <div
            className="sub-menu"
            style={{
              height: activeMenu === "create" ? "40px" : "0px",
              overflow: "hidden",
              transition: "height 0.3s ease",
            }}
          >
            <ul>
              <li>
                <button type="button" onClick={gotoCreateArticle}>
                  Create task
                </button>
              </li>
            </ul>
          </div>
        </li>
        {/* Archived */}
        <li>
          <button
            type="button"
            className={activeMenu === "archived" ? "active" : ""}
            onClick={gotoArchivedTasks}
          >
            <i className="fa-solid fa-box-archive"></i>
            <p>Archived</p>
            <i className="ai-chevron-down-small"></i>
          </button>
        </li>
      </ul>
    </aside>
  );
}
