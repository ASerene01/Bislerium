import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "./Auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [sortBy, setSortBy] = useState("blogPopularity");
  const { isLoggedIn } = useAuth();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(6); // Number of blogs per page

  // Function to fetch blogs
  const fetchBlogs = async () => {
    try {
      let url;
      if (sortBy === "blogPopularity") {
        url = `https://localhost:7274/api/Blogs/BlogsByPopularity`;
      } else if (sortBy === "Recency") {
        url = `https://localhost:7274/api/Blogs/Recency`;
      } else if (sortBy === "Random") {
        url = `https://localhost:7274/api/Blogs/RandomBlogs`;
      }
      const response = await axios.get(url);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs(); // Fetch blogs when component mounts or when sortBy changes
  }, [sortBy]);

  const handleLike = async (blogid) => {
    try {
      await axios.post(
        `https://localhost:7274/api/Blogs/${blogid}/upvote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchBlogs(); // Refresh blogs after like/dislike
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  const handleDislike = async (blogid) => {
    try {
      await axios.post(
        `https://localhost:7274/api/Blogs/${blogid}/downvote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchBlogs(); // Refresh blogs after like/dislike
    } catch (error) {
      console.error("Error disliking blog:", error);
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Calculate pagination
  const indexOfLastBlog = currentPage * perPage;
  const indexOfFirstBlog = indexOfLastBlog - perPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(blogs.length / perPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-primary">Welcome to Bislerium Blogs</h1>
      <div className="d-flex mb-3">
        <label htmlFor="sortBy" className="me-2">
          Sort By:
        </label>
        <select
          id="sortBy"
          className="form-select"
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="blogPopularity">Blog popularity</option>
          <option value="Recency">Recent Blogs</option>
          <option value="Random">Random Blogs</option>
        </select>
      </div>
      <hr className="bg-primary" />
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {currentBlogs.map((blog) => (
          <div key={blog.blogId} className="col">
            <div className="card h-100">
              <div className="card-body">
                <h2 className="card-title">{blog.title}</h2>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  {isLoggedIn && (
                    <div className="d-flex">
                      <button
                        className="post-btn me-2"
                        onClick={() => handleLike(blog.blogId)}
                      >
                        <i className="bi bi-hand-thumbs-up"></i>
                      </button>
                      <button
                        className="dislike-btn"
                        onClick={() => handleDislike(blog.blogId)}
                      >
                        <i className="bi bi-hand-thumbs-down"></i>
                      </button>
                    </div>
                  )}
                  <div>
                    <small className="me-2">Author: {blog.author}</small>
                    <small>
                      Published: {new Date(blog.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
                <hr className="mt-3 mb-2" />
                <div className="mt-3">
                  <Link
                    to={`/individualBlog/${blog.blogId}`}
                    className="btn btn-primary"
                  >
                    View Blog
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination mt-4">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`btn ${
              currentPage === index + 1 ? "btn-primary" : "btn-secondary"
            }`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
