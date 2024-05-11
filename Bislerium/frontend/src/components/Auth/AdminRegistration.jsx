import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TextInput from "../Common/TextInput";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
    email: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the registration endpoint
      const response = await axios.post(
        "https://localhost:7274/api/Auth/register",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          userName: formData.userName,
          password: formData.password,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          role: "Admin",
        }
      );
      console.log(response.status);
      // Check if registration was successful
      if (response.status === 201) {
        // Reset form data
        setFormData({
          firstName: "",
          lastName: "",
          userName: "",
          password: "",
          email: "",
          phoneNumber: "",
        });
        // Show success message
        toast("Registration successful! You can now log in.");
        // Redirect to the login page
        navigate("/login");
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error(error.response);
      // Handle registration failure
      setError("Registration failed. Please try again later.");
    }
  };
  //const redirect = () = {
  //navigate('/login')}
  return (
    <div class="container-lg d-flex vh-100 align-items-center justify-content-center">
      <div class="card text-center main-card shadow-lg">
        <div class="card-header bg-first text-altbody login-title">
          REGISTER
        </div>
        <div class="card-body">
          <form onSubmit={handleSubmit}>
            <div class="input-group my-3 px-5">
              <i class="bi bi-envelope input-group-text"></i>
              <TextInput
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
            </div>
            <div class="input-group my-3 px-5">
              <i class="bi bi-person input-group-text"></i>
              <TextInput
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Username"
              />
            </div>
            <div class="input-group my-3 px-5">
              <i class="bi bi-telephone input-group-text"></i>
              <TextInput
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone number"
              />
            </div>
            <div class="input-group my-3 px-5">
              <i class="bi bi-person input-group-text"></i>
              <TextInput
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
              />
            </div>
            <div class="input-group my-3 px-5">
              <i class="bi bi-person input-group-text"></i>
              <TextInput
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
              />
            </div>
            <div class="input-group my-3 px-5">
              <i class="bi bi-key input-group-text"></i>
              <TextInput
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </div>

            <button class="btn btn-third login-button my-3 text-first">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
