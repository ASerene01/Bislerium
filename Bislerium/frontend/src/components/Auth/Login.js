import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import TextInput from "../Common/TextInput";
import { useAuth } from "../Auth/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

  const [updateData, setUpdateData] = useState({
    email: "",
  });
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
        toast.success("Login Successful");
        navigate("/UserProfile");
        window.location.reload();
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      toast.error("Login failed. Please check your username and password");
      setError("Login failed. Please check your username and password.");
    }
  };
  const handleForgetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://localhost:7274/api/Auth/forgot-password/${updateData.email}`
      );
      toast.success("Sent Email");
      if (response.status === 200) {
        navigate(0);
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error(error.response);
      alert("Update failed. Please try again later.");
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
          <div className="mt-2">
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#updateModal"
              onClick={() => {
                setUpdateData({
                  email: "",
                });
              }}
            >
              Forget Password?
            </button>
            <div
              className="modal fade"
              id="updateModal"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                {" "}
                {/* Added modal-lg class */}
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title" id="exampleModalLabel">
                      Forget Password
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <form onSubmit={handleForgetPassword}>
                    <div className="modal-body">
                      <div className="mb-3">
                        <TextInput
                          type="text"
                          name="title"
                          value={updateData.email}
                          onChange={(e) =>
                            setUpdateData({
                              ...updateData,
                              email: e.target.value,
                            })
                          }
                          placeholder="Email"
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-primary">Send Email</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
