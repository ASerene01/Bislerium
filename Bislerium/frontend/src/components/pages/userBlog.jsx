import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import TextInput from "../Common/TextInput";
import { useNavigate } from "react-router-dom";

const UserBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [updateId, setUpdateId] = useState(null);
  const token = localStorage.getItem("token");
  const { user, isLoggedIn, handleLogout } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });

  const [updateData, setUpdateData] = useState({
    title: "",
    body: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
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

    fetchBlogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
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

      if (response.status === 201) {
        setFormData({
          title: "",
          body: "",
        });
        alert("Added successfully! You can now log in.");
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error(error.response);
      setError("Registration failed. Please try again later.");
    }
  };
  const handleDelete = async (blogId) => {
    //blogId.preventDefault();

    try {
      const response = await axios.delete(
        `https://localhost:7274/api/Blogs/${blogId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Blog Deleted Sucessfully");
    } catch (error) {
      console.error(error.response);
      setError("Blog Not Deleted");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `https://localhost:7274/api/Blogs/${updateId}`,
        {
          title: updateData.title,
          body: updateData.body,
          BlogId: updateId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setUpdateData({
          title: "",
          body: "",
        });
        alert("Update successful! You can now log in.");
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error(error.response);
      setError("Update failed. Please try again later.");
    }
  };

  const handleUpdateId = (blogId) => {
    setUpdateId(blogId);
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-primary">Hello to your blog</h1>

      <div className="d-flex justify-content-between align-items-center">
        <button
          type="button"
          className="btn btn-sm btn-primary me-auto" // Added btn-sm and me-auto classes
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Add Blog
        </button>
      </div>
      <hr className="bg-primary" />

      {/* Add Blog Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
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
                <div className="mb-3">
                  <TextInput
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                  />
                </div>
                <div className="mb-3">
                  <TextInput
                    type="text"
                    name="body"
                    value={formData.body}
                    onChange={handleChange}
                    placeholder="Body"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary">Add Blog</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Display Blogs */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {blogs.map((blog) => (
          <div key={blog.blogId} className="col">
            <div className="card h-100">
              <div className="card-body">
                <h2 className="card-title">{blog.title}</h2>

                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div>
                    <small className="me-2">Author: {blog.author}</small>
                    <small>
                      Published: {new Date(blog.createdAt).toLocaleDateString()}
                    </small>
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#updateModal"
                      onClick={() => handleUpdateId(blog.blogId)}
                    >
                      Update Blog
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger mt-4"
                      onClick={() => handleDelete(blog.blogId)}
                    >
                      Delete Blog
                    </button>
                  </div>
                  <div></div>
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

      {/* Update Blog Modal */}
      <div
        className="modal fade"
        id="updateModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Update Blog
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleUpdateSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <TextInput
                    type="text"
                    name="title"
                    value={updateData.title}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, title: e.target.value })
                    }
                    placeholder="Title"
                  />
                </div>
                <div className="mb-3">
                  <TextInput
                    type="text"
                    name="body"
                    value={updateData.body}
                    onChange={(e) =>
                      setUpdateData({ ...updateData, body: e.target.value })
                    }
                    placeholder="Body"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary">Update Blog</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBlog;
