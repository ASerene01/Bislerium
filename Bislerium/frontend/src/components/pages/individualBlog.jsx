import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const IndividualBlog = () => {
  const { id } = useParams();

  const [newComment, setNewComment] = useState("");

  // Function to handle adding a new comment
  // const fetchBlogs = async (request) => {
  const handleAddComment = async () => {
    try {
      // console.log(newComment, "0-0-0-0-0-0-0-0-0-0-0-0-0-0-0-0");
      const data = {
        content: newComment,
        blogId: id,
      };
      // console.log(data);
      const response = await axios.post(
        `https://localhost:7274/api/Blogs/${id}/comments`,
        data
      );
      // setBlogs(response.data);
      // console.log(response.data, "-=-=-=-=-=-=-=-");
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
    setNewComment("");
  };

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Fetch blogs from the backend API
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7274/api/Blogs/${id}`
        );
        setBlogs(response.data);
        // console.log(response.data, "-=-=-=-=-=-=-=-");
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    // console.log(fetchBlogs);
    fetchBlogs();
  }, []);

  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Fetch blogs from the backend API
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7274/api/Blogs/${id}/comments`
        );
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchComments();
  }, []);

  // console.log(comments);

  return (
    <>
      <div
        className="container my-5"
        style={{ backgroundColor: "#333", color: "#fff", padding: "30px" }}
      >
        <div className="row">
          {/* Main Content */}
          <div className="col-md-9">
            <div className="intro mb-4">
              <h2 style={{ fontSize: "2.5rem" }}>{blogs.title}</h2>
              <p
                className="lead"
                style={{ fontSize: "1.3rem", fontWeight: 400 }}
              >
                {blogs.body}
              </p>
            </div>

            <h3
              className="header-one"
              style={{
                borderBottom: "2px solid #ffc107",
                paddingBottom: "5px",
                marginBottom: "20px",
              }}
            >
              Comments
            </h3>

            {/* Render existing comments */}
            {comments.map((comment, index) => (
              <div
                key={index}
                className="comment mb-4"
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "5px",
                  padding: "15px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="post-content">
                  <h4
                    className="comment-user"
                    style={{ fontSize: "1.2rem", color: "#ffc107" }}
                  >
                    {comment.userId}
                  </h4>
                  {/* Additional content sections can be added here */}
                </div>
                <div className="outro">
                  <p className="comment-content" style={{ fontSize: "1rem" }}>
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Add Comment Section */}
            <div className="mb-4">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Add your comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{ fontSize: "1rem" }}
              ></textarea>
              <button
                className="btn btn-primary mt-3"
                onClick={handleAddComment}
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndividualBlog;
