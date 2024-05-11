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
    imageName: "",
    imageSrc: "hello",
    imageFile: null,
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
          "https://localhost:7274/currentUserBlogs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
      console.log(formData);
      const addData = new FormData();
      addData.append("title", formData.title);
      addData.append("body", formData.body);
      addData.append("imageName", formData.imageName);
      addData.append("imageFile", formData.imageFile);
      for (var pair of addData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }
      const response = await axios.post(
        "https://localhost:7274/api/Blogs",
        addData,
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
        alert("Added Blog successfully! ");
        navigate(0);
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error(error.response);
      setError("Registration failed. Please try again later.");
    }
  };
  const handleDelete = async (blogId) => {
    try {
      const response = await axios.delete(
        `https://localhost:7274/api/Blogs/${blogId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      alert("Blog Deleted Sucessfully");
      navigate(0);
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
        navigate(0);
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error(error.response);
      setError("Update failed. Please try again later.");
    }
  };

  const handleUpdateFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];

      const reader = new FileReader();
      reader.onload = (x) => {
        setFormData({
          ...formData,
          imageName: imageFile.name,
          imageFile: imageFile,
          imageSrc: x.target.result,
        });
      };

      reader.readAsDataURL(imageFile);
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-end align-items-right">
        <button
          type="button"
          className="btn btn-sm btn-success"
          style={{ maxWidth: "150px" }} // Set a maximum width for the button
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Add Blog
        </button>
        {/* Add Blog Modal */}
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            {" "}
            {/* Added modal-lg class */}
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
                    <textarea
                      className="form-control"
                      name="body"
                      value={formData.body}
                      onChange={handleChange}
                      placeholder="Body"
                      rows="5"
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <input
                      type="file"
                      accept="image/*"
                      className={"form-control-file"}
                      onChange={handleUpdateFile}
                      id="image-uploader"
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
      </div>
      <hr className="bg-primary" />
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {console.log(blogs)}
        {blogs.map((blog) => (
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
                <div className="d-flex justify-content-between align-items-center mt-3"></div>
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
                <div className="mt-3 mb-2">
                  <Link
                    to={`/individualBlog/${blog.blogId}`}
                    className="btn btn-primary"
                  >
                    View Blog
                  </Link>
                </div>
                <div className="mt-3">
                  <button
                    type="button"
                    className="btn btn-success me-2"
                    data-bs-toggle="modal"
                    data-bs-target="#updateModal"
                    onClick={() => {
                      setUpdateId(blog.blogId);
                      setUpdateData({
                        title: blog.title,
                        body: blog.body,
                      });
                    }}
                    style={{ maxWidth: "120px" }} // Set a maximum width for the button
                  >
                    Update Blog
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDelete(blog.blogId)}
                    style={{ maxWidth: "120px" }} // Set a maximum width for the button
                  >
                    Delete Blog
                  </button>
                  {/* Update Blog Modal */}
                  <div
                    className="modal fade"
                    id="updateModal"
                    tabIndex="-1"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-lg">
                      {" "}
                      {/* Added modal-lg class */}
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1
                            className="modal-title fs-5"
                            id="exampleModalLabel"
                          >
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
                                  setUpdateData({
                                    ...updateData,
                                    title: e.target.value,
                                  })
                                }
                                placeholder="Title"
                              />
                            </div>
                            <div className="mb-3">
                              <textarea
                                className="form-control"
                                name="body"
                                value={updateData.body}
                                onChange={(e) =>
                                  setUpdateData({
                                    ...updateData,
                                    body: e.target.value,
                                  })
                                }
                                placeholder="Body"
                                rows="5"
                              ></textarea>
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button className="btn btn-primary">
                              Update Blog
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
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
