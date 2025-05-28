import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setToken } from "../../features/userSlice";
import api from "../../api/api";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "./UserLogin.css";

function UserLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (user && storedUser) {
      navigate("/home");
    }
  }, [user, navigate]);

  const validate = () => {
    let isValid = true;
    const newError = { email: "", password: "" };
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!form.email) {
      newError.email = "Email is required";
      isValid = false;
    } else if (!emailPattern.test(form.email)) {
      newError.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!form.password) {
      newError.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 8) {
      newError.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    setErrors(newError);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await api.post("/auth/login", form);
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
        dispatch(setUser(response.data.user));
        dispatch(setToken(response.data.token));
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        navigate("/home");
      } catch (error) {
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

  const handleSignup = (e) => {
    e.preventDefault();
    navigate("/signup");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Log In</h1>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="input-field"
              placeholder="Enter your email"
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
              placeholder="Enter your password"
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
            <button className="btn" type="submit">
              Log In
            </button>
          </div>
        </form>
        <div className="signup-redirect">
          Don't have an account?{" "}
          <a href="#" className="signup-link" onClick={handleSignup}>
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
