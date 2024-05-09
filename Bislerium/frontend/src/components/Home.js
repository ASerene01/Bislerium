import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Import Link for navigation

const Home = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Fetch blogs from the backend API
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("https://localhost:7274/api/Blogs");
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    // console.log(fetchBlogs);
    fetchBlogs();
  }, []);
  console.log("blogs", blogs);
  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-primary">Welcome to Bislerium Blogs</h1>
      <hr className="bg-primary" />
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {blogs.map((blog) => (
          <div key={blog.id} className="col">
            <div className="card h-100">
              <div className="card-body">
                <h2 className="card-title">{blog.title}</h2>
                <p className="card-text">{blog.body}</p>
                {blog.images &&
                  blog.images.map((image) => (
                    <img
                      key={image.id}
                      src={image.url}
                      alt={image.alt}
                      className="img-fluid mb-3"
                    />
                  ))}
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    <button className="btn btn-outline-primary me-2">
                      Like
                    </button>
                    <button className="btn btn-outline-danger">Dislike</button>
                  </div>
                  <div>
                    <small className="me-2">Author: {blog.author}</small>
                    <small>
                      Published: {new Date(blog.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
                <hr className="mt-3 mb-2" />

                <div className="mt-3">
                  {/* View Blog Button */}

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
    </div>
  );
};

export default Home;
