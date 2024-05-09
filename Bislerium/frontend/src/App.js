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

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="container p-5 pt-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            {/* <Route path="/pages/blog" element={<Blog />} /> */}
            <Route path="/individualBlog/:id" element={<IndividualBlog />} />
            <Route path="/UserBlog/:userId" element={<UserBlog />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
