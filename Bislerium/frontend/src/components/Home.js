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
      const updatedBlogs = await Promise.all(
        response.data.map(async (blog) => {
          try {
            const upvoteCountResponse = await axios.get(
              `https://localhost:7274/api/Blogs/upvoteCount/${blog.blogId}`
            );

            const updatedBlog = {
              ...blog,
              upvote: upvoteCountResponse.data, // Set likes to fetched like count
            };

            return updatedBlog;
          } catch (error) {
            console.error(
              `Error fetching like count for blog ID ${blog.blogId}:`,
              error
            );
            return blog; // Return original blog in case of error
          }
        })
      );
      const newUpdatedBlogs = await Promise.all(
        updatedBlogs.map(async (blog) => {
          try {
            const downvoteCountResponse = await axios.get(
              `https://localhost:7274/api/Blogs/downvoteCount/${blog.blogId}`
            );

            const updatedBlog = {
              ...blog,
              downvote: downvoteCountResponse.data, // Set likes to fetched like count
            };

            return updatedBlog;
          } catch (error) {
            console.error(
              `Error fetching like count for blog ID ${blog.blogId}:`,
              error
            );
            return blog; // Return original blog in case of error
          }
        })
      );

      setBlogs(newUpdatedBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
    console.log(blogs); // Fetch blogs when component mounts or when sortBy changes
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
      // Updated Dropdown Section with Right-Aligned Dropdown
      <div className="dropdown show d-flex justify-content-end">
        <select
          className="btn btn-secondary dropdown-toggle"
          id="dropdownMenuLink"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          value={sortBy}
          onChange={handleSortChange}
          style={{ minWidth: "200px" }} // Optional: Set a minimum width for better appearance
        >
          <option className="dropdown-item" value="blogPopularity">
            Blog popularity
          </option>
          <option className="dropdown-item" value="Recency">
            Recent Blogs
          </option>
          <option className="dropdown-item" value="Random">
            Random Blogs
          </option>
        </select>
      </div>
      <hr className="bg-primary" />
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {currentBlogs.map((blog) => (
          <div key={blog.blogId} className="col">
            <div className="card h-100">
              {blog.imageSrc == "https://localhost:7274/Images/" ? (
                <img
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                  className="card-img-top"
                  alt={blog.title}
                />
              ) : (
                <img
                  src={blog.imageSrc}
                  className="card-img-top"
                  alt={blog.title}
                />
              )}

              <div className="card-body">
                <h2 className="card-title">{blog.title}</h2>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  {isLoggedIn && (
                    <div className="d-flex">
                      <button
                        className="btn btn-outline-primary me-2"
                        onClick={() => handleLike(blog.blogId)}
                      >
                        {blog.upvote}
                        <i className="bi bi-hand-thumbs-up"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleDislike(blog.blogId)}
                      >
                        {blog.downvote}
                        <i className="bi bi-hand-thumbs-down"></i>
                      </button>
                    </div>
                  )}
                </div>
                <hr className="mt-3 mb-2" />
                <div>
                  <small className="me-2">
                    Blog Score: {blog.blogPopularity}
                  </small>
                </div>
                <small>
                  Published: {new Date(blog.createdAt).toLocaleDateString()}
                </small>
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
      <div className="pagination mt-4 d-flex justify-content-center">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`btn btn-outline-primary ${
              currentPage === index + 1 ? "active" : ""
            } btn-sm me-1`}
            onClick={() => handlePageChange(index + 1)}
            style={{
              width: "auto", // Set width to auto to fit content
              padding: "0.5rem", // Adjust padding for spacing
              minWidth: "unset", // Ensure min width is unset
              fontWeight: "bold",
              borderRadius: "30px",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
