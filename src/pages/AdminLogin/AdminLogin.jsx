import "./AdminLogin.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/apiServices";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    if (admin) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const validate = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!form.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailPattern.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await adminLogin(form);
        Toastify({
          text: response.data.msg,
          duration: 3000,
          gravity: "top",
          position: "right",
          style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)",
          },
          close: true,
        }).showToast();
        localStorage.setItem("admin", JSON.stringify(response.data.admin));
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } catch (error) {
        console.log("login failed error", error);
        Toastify({
          text: error.response?.data?.msg || "Login failed",
          duration: 3000,
          gravity: "top",
          position: "right",
          style: { background: "#ef4444" },
          close: true,
        }).showToast();
      }
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Admin Panel</h1>
          </div>
          <form className="input-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="input-field"
                placeholder="Enter Your Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                aria-describedby="email-error"
              />
              {errors.email && (
                <div id="email-error" className="error-message">
                  {errors.email}
                </div>
              )}
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="input-field"
                placeholder="Enter Your Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                aria-describedby="password-error"
              />
              {errors.password && (
                <div id="password-error" className="error-message">
                  {errors.password}
                </div>
              )}
            </div>
            <div className="btn-class">
              <button className="btn-login">Login</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;