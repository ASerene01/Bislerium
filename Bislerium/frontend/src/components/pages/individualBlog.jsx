import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import TextInput from "../Common/TextInput";
import { toast } from "react-toastify";
const IndividualBlog = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const { user, isLoggedIn, handleLogout } = useAuth();
  const [updateId, setUpdateId] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [blogs, setBlogs] = useState({});
  const [comments, setComments] = useState([]);

  const [updateData, setUpdateData] = useState({
    comment: "",
  });
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7274/api/Blogs/${id}`
        );
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7274/api/Blogs/${id}/comments`
        );
        const updatedComments = await Promise.all(
          response.data.map(async (comment) => {
            try {
              const userResponse = await axios.get(
                `https://localhost:7274/api/User/GetUser/${comment.userId}`
              );

              const updatedComment = {
                ...comment,
                firstName: userResponse.data.firstName,
                lastName: userResponse.data.lastName,
              };

              return updatedComment;
            } catch (error) {
              console.error(
                `Error fetching like names for user ID ${comment.userId}:`,
                error
              );
              return comment; // Return original blog in case of error
            }
          })
        );
        const newUpdatedCommentsAfterUpvote = await Promise.all(
          updatedComments.map(async (comment) => {
            try {
              const upvoteCountResponse = await axios.get(
                `https://localhost:7274/api/Comments/upvoteCount/${comment.commentId}`
              );

              const updatedComment = {
                ...comment,
                upvote: upvoteCountResponse.data, // Set likes to fetched like count
              };

              return updatedComment;
            } catch (error) {
              console.error(
                `Error fetching like count for blog ID ${comment.commentId}:`,
                error
              );
              return comment; // Return original blog in case of error
            }
          })
        );
        const newUpdatedCommentsAfterDownvote = await Promise.all(
          newUpdatedCommentsAfterUpvote.map(async (comment) => {
            try {
              const downvoteCountResponse = await axios.get(
                `https://localhost:7274/api/Comments/downvoteCount/${comment.commentId}`
              );

              const updatedComment = {
                ...comment,
                downvote: downvoteCountResponse.data, // Set likes to fetched like count
              };

              return updatedComment;
            } catch (error) {
              console.error(
                `Error fetching like count for blog ID ${comment.commentId}:`,
                error
              );
              return comment; // Return original blog in case of error
            }
          })
        );

        setComments(newUpdatedCommentsAfterDownvote);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchBlog();
    fetchComments();
  }, [id]);

  const handleAddComment = async () => {
    try {
      const data = {
        content: newComment,
        blogId: id,
      };
      const response = await axios.post(
        `https://localhost:7274/api/Blogs/${id}/comments`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewComment("");
      navigate(0);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleLike = async (commentId) => {
    try {
      console.log(commentId);
      await axios.post(
        `https://localhost:7274/api/Comments/${commentId}/upvote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(0);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleDislike = async (commentId) => {
    try {
      await axios.post(
        `https://localhost:7274/api/Comments/${commentId}/downvote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate(0);
    } catch (error) {
      console.error("Error disliking comment:", error);
    }
  };
  const handleCommentDelete = async (commentId) => {
    try {
      await axios.delete(
        `https://localhost:7274/api/Comments/${commentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate(0);
    } catch (error) {
      console("Error liking comment:", error);
    }
  };

  const handleCommentEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://localhost:7274/api/Comments/${updateId}`,
        {
          content: updateData.comment,
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
      toast("Update failed. Please try again later.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h2 className="mb-3" style={{ color: "#ffc107" }}>
            {blogs.title}
          </h2>
          <img
            src="https://media.formula1.com/image/upload/t_16by9Centre/f_auto/q_auto/v1707905211/fom-website/2023/Mercedes/W15%20launch/Mercedes-AMG%20W15%20E%20PERFORMANCE%20-%20Lewis%20Hamilton%20-%20Front%20Quarter.jpg"
            alt="Blog Image"
            className="img-fluid mb-3"
          />

          <p className="lead mb-4" style={{ color: "#fff" }}>
            {blogs.body}
          </p>
          <h3 className="mb-4" style={{ color: "#ffc107" }}>
            Comments
          </h3>
          {isLoggedIn && (
            <div className="mb-4">
              <textarea
                className="form-control mb-3"
                rows="3"
                placeholder="Add your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{
                  backgroundColor: "#444",
                  color: "#fff",
                  border: "1px solid #888",
                }}
              ></textarea>
              <button className="btn btn-primary" onClick={handleAddComment}>
                Add Comment
              </button>
            </div>
          )}
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="card mb-3"
              style={{ backgroundColor: "#444", color: "#fff" }}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5
                      className="card-title"
                      style={{ color: "#ffc107", marginBottom: "0" }}
                    >
                      {comment.firstName} {comment.lastName}
                    </h5>
                    <p className="card-text">{comment.content}</p>
                  </div>
                  {isLoggedIn && user.UserId === comment.userId && (
                    <Dropdown>
                      <Dropdown.Toggle variant="" id="dropdown-basic">
                        <i className="bi bi-three-dots"></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          data-bs-toggle="modal"
                          data-bs-target="#updateModal"
                          onClick={() => {
                            setUpdateData({
                              comment: comment.content,
                            });
                            setUpdateId(comment.commentId);
                          }}
                        >
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleCommentDelete(comment.commentId)}
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </div>
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
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          Edit Comment
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <form onSubmit={handleCommentEdit}>
                        <div className="modal-body">
                          <div className="mb-3">
                            <TextInput
                              type="text"
                              name="title"
                              value={updateData.comment}
                              onChange={(e) =>
                                setUpdateData({
                                  ...updateData,
                                  comment: e.target.value,
                                })
                              }
                              placeholder="Title"
                            />
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button className="btn btn-primary">
                            Update Comment
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                {isLoggedIn && (
                  <div className="d-flex">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleLike(comment.commentId)}
                      style={{ width: "80px" }}
                    >
                      {comment.upvote}
                      <i className="bi bi-hand-thumbs-up"></i> Like
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDislike(comment.commentId)}
                      style={{ width: "80px" }}
                    >
                      {comment.downvote}
                      <i className="bi bi-hand-thumbs-down"></i> Dislike
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndividualBlog;
