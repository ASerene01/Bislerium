// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./components/Home";
import IndividualBlog from "./components/pages/individualBlog";
import UserBlog from "./components/pages/userBlog";
// import Blog from "./components/pages/userBlog/Blog";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar/Navbar";
import { AuthProvider } from "./components/Auth/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";
import Dashboard from "./components/pages/Dashboard";
import { useAuth } from "./components/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import UserProfile from "./components/pages/userProfile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  // const { user, isLoggedIn, handleLogout } = useAuth();
  // const navigate = useNavigate();
  // if (user) {
  //   if (user.Role === "Admins") {
  //     navigate("/AdminDashboard");
  //   } else {
  //     navigate("/");
  //   }
  // }

  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="container-fluid p-0">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            {/* <Route path="/pages/blog" element={<Blog />} /> */}
            <Route path="/individualBlog/:id" element={<IndividualBlog />} />
            <Route path="/UserBlog/:userId" element={<UserBlog />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/UserProfile" element={<UserProfile />} />
          </Routes>
          <ToastContainer position="bottom-left" />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
