import Aside from "../components/Aside";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
export default function MainLayout() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <div className="flex h-screen">
      <Aside />
      <div
        className="flex-1 overflow-auto"
        style={{ marginLeft: isMobile ? 60 : 0 }} // 60px = width collapsed
      >
        <Outlet />
      </div>
    </div>
  );
}
