import React, { useState, useEffect } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import image from "../tl.webp";
import logo from "../Tempo-removebg-preview.png";
import baner1 from "../baner1.png";
import "../App.css";
export default function Login({ setAuth }) {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const words = ["page", "world", "space", "universe"]; // chữ luân phiên
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRemember, setIsRemember] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser(username, password);
    console.log("RES => ", res, typeof res);

    if (res.success) {
      setAuth(true);
      navigate("/home");
    } else {
      alert(res.error || "Login failed!");
    }
  };
  useEffect(() => {
    const current = words[index];
    let speed = 120;

    if (isDeleting) speed = 60;

    const typing = setTimeout(() => {
      setText((prev) => {
        if (!isDeleting) {
          // Gõ thêm ký tự
          const updated = current.substring(0, prev.length + 1);
          if (updated === current) {
            setTimeout(() => setIsDeleting(true), 1000); // Đợi 1s rồi xoá
          }
          return updated;
        } else {
          // Xoá ký tự
          const updated = current.substring(0, prev.length - 1);
          if (updated === "") {
            setIsDeleting(false);
            setIndex((prevIndex) => (prevIndex + 1) % words.length);
          }
          return updated;
        }
      });
    }, speed);

    return () => clearTimeout(typing);
  }, [text, isDeleting, index,words]);

  return (
    <div>
      <nav className="bg-[#F3F4F6] p-4 flex justify-start space-x-4  border-b border-gray-950">
        <i className="fa-regular fa-circle"></i>
        <i className="fa-regular fa-circle"></i>
        <i className="fa-regular fa-circle"></i>
      </nav>
      <div className="flex items-center justify-center h-screen bg-[#F3F4F6]">
        <div className="text-left mt-10">
          <h1 className="text-6xl md:text-7xl font-extrabold leading-none">
            <span className="block text-gray-900">Welcome to</span>
            {/* Chữ đổi động */}
            <span
              className="
          block 
          text-blue-600 
          mt-2 
          transition-all 
          duration-700 
          ease-out 
          opacity-100 
          animate-fade
        "
            >
              my {text}
            </span>{" "}
          </h1>
        </div>
        <div className="row2">
          <img className="h-[333px] pl-8" src={image} alt="" />
        </div>
        <div className="card">
          <div className="content">
            <img src={logo} className="logo"  alt="Logo ứng dụng" />
            <h2>Login</h2>
            <h3>Please enter your credentials</h3>
            <form onSubmit={handleSubmit}>
              <input
                value={username}
                onChange={(e) => setusername(e.target.value)}
                type="email"
                placeholder="Email"
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
              />
              <div className="row flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isRemember}
                    onChange={(e) => setIsRemember(e.target.checked)}
                  />{" "}
                  <label>Remember me</label>
                </div>
                <Link href="/forgot-password">Forgot password?</Link>
              </div>
              <button type="submit">Login</button>
            </form>
            <p className="have">
              Don't have an account? <Link href="/register">Sign Up</Link>
            </p>
          </div>
          <div className="hero">
            <img src="logo-white.svg"  alt="Logo ứng dụng" className="logo-white" />
            <img src={baner1 }  alt="Logo ứng dụng" className="graphic" />
          </div>
        </div>
      </div>
    </div>
  );
}
