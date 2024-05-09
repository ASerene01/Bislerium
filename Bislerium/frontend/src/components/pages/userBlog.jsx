import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import TextInput from "../Common/TextInput";
import { useNavigate } from "react-router-dom";

const UserBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const token = localStorage.getItem("token");
  const { user, isLoggedIn, handleLogout } = useAuth(); // Use useAuth hook to access authentication context
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });
  // const navigate = useNavigate();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    // Fetch blogs from the backend API
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7274/currentUserBlogs"
        );
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    // console.log(fetchBlogs);
    fetchBlogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the registr ation endpoint
      const response = await axios.post(
        "https://localhost:7274/api/Blogs",
        {
          title: formData.title,
          body: formData.body,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log({
        title: formData.title,
        body: formData.lastName,
      });
      // Check if registration was successful
      if (response.status === 201) {
        // Reset form data
        setFormData({
          title: "",
          body: "",
        });
        // Show success message
        alert("Registration successful! You can now log in.");
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

  return (
    <div className="container mt-5">
      <div class="d-flex justify-content-around">
        <div>
          <h1 className="mb-4 text-primary">Hello to your blog</h1>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Add Blog
          </button>

          {/* <!-- Modal --> */}
          <div
            class="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Add Blog
                  </h1>

                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="flex flex-row mb-3">
                      <div className="input-group my-3 px-5">
                        <i className="bi bi-envelope input-group-text"></i>
                        <TextInput
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="Title"
                        />
                      </div>
                      <div className="input-group my-3 px-5">
                        <i className="bi bi-person input-group-text"></i>
                        <TextInput
                          type="text"
                          name="body"
                          value={formData.body}
                          onChange={handleChange}
                          placeholder="Body"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-primary">Add Blog</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="flex flex-col justify-content-between ">
        <p className="text-white">asdasd</p>
        <p className="text-white">asdasd</p>
      </div> */}
      {/* <h1 className="mb-4 text-primary">Hello {user.FirstName}</h1> */}
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
                <h4 className="mb-3">Comments</h4>
                {blog.comments &&
                  blog.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="border border-primary p-2 mb-2"
                    >
                      <strong>{comment.author}:</strong> {comment.text}
                    </div>
                  ))}
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

export default UserBlog;
