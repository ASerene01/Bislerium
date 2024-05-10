import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext"; // Import useAuth hook

const Navbar = () => {
  const { user, isLoggedIn, handleLogout } = useAuth(); // Use useAuth hook to access authentication context
  // console.log("0-0-0-0-0-0-0-0-0-0-0", user);
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Bislerium Blogs
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav ms-auto">
            {" "}
            {/* 'ms-auto' class for right alignment */}
            <Link className="nav-link active" aria-current="page" to="/">
              Home
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  className="nav-link btn btn-link"
                  to={`/UserBlog/${user.UserId}`}
                >
                  UserBlog
                </Link>
                <Link className="nav-link btn btn-link" to="/UserProfile">
                  UserProfile
                </Link>
                <a className="nav-link btn btn-link" onClick={handleLogout}>
                  Logout
                </a>
              </>
            ) : (
              <>
                <Link className="nav-link" to="/login">
                  Login
                </Link>
                <Link className="nav-link" to="/register">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
