import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import TextInput from "../Common/TextInput";
import { useAuth } from "../Auth/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ userName: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { user, isLoggedIn, handleLogout } = useAuth();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://localhost:7274/api/Auth/login",
        formData
      );
      console.log(user?.Role);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);

        setFormData({ userName: "", password: "" });

        navigate("/");
        window.location.reload();
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      setError("Login failed. Please check your username and password.");
    }
  };

  return (
    <div className="container d-flex vh-100 align-items-center justify-content-center">
      <div className="card text-center main-card shadow">
        <div className="card-header bg-primary text-white">LOGIN</div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="input-group my-3">
              <span className="input-group-text">
                <i className="bi bi-person"></i>
              </span>
              <TextInput
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Username"
                className="form-control"
              />
            </div>
            <div className="input-group my-3">
              <span className="input-group-text">
                <i className="bi bi-key"></i>
              </span>
              <TextInput
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="form-control"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <button type="submit" className="btn btn-primary w-100 my-3">
              Login
            </button>
          </form>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mt-2">
            Don't have an account?{" "}
            <Link to="/register" className="ml-1">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
