import React, { useState,useEffect } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import image1 from "../tl2.png";
import logo from "../Tempo-removebg-preview.png";
import baner2 from "../baner2.png";

export default function Register() {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
    const words = ["page", "world", "space", "universe"]; // chữ luân phiên
    const [text, setText] = useState("");
    const [index, setIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    await registerUser(username, password);
    alert("Register success! Please login.");
    navigate("/login");
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
  }, [text, isDeleting, index]);
  return (
      <div className="flex items-center justify-center h-screen bg-[#F3F4F6]">
            
           
            <div className="card">
              <div className="hero">
                <img src="logo-white.svg" className="logo-white" />
                <img src={baner2} className="graphic" />
              </div>
              <div className="content">
                <img src={logo} className="logo" />
                <h2>Register</h2>
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
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    placeholder="Confirm Password"
                  />
                  
                  <button>Register</button>
                </form>
                <p className="have">
                  Have an account? <a href="/login">Login</a>
                </p>
              </div>
              
              
            </div>
             <div className="row2">
              <img className="h-[333px] pr-8" src={image1} alt="" />
            </div>
            <div className="text-left mt-10">
              <h1 className="text-6xl md:text-7xl font-extrabold leading-none">
                <span className="block text-gray-900">Start to</span>
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
          </div>
  );
}
