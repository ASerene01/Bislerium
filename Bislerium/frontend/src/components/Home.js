import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        // Fetch blogs from the backend API
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('https://localhost:7274/api/Blogs');
                setBlogs(response.data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div className="container">
            <h1 className="mt-5 mb-4">Welcome to Bislerium Blogs</h1>
            <hr className="text-white" />
            {blogs.map(blog => (
                <div key={blog.id} className="card mb-4">
                    <div className="card-body">
                        <h2 className="card-title">{blog.title}</h2>
                        <p className="card-text">{blog.body}</p>
                        {blog.images && blog.images.map(image => (
                            <img key={image.id} src={image.url} alt={image.alt} className="img-fluid mb-3" />
                        ))}
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <button className="btn btn-primary me-2">Like</button>
                                <button className="btn btn-danger">Dislike</button>
                            </div>
                            <div>
                                <small className="me-2">Author: {blog.author}</small>
                                <small>Published: {new Date(blog.createdAt).toLocaleDateString()}</small>
                            </div>
                        </div>
                        <hr />
                        <h4>Comments</h4>
                        {blog.comments && blog.comments.map(comment => (
                            <div key={comment.id} className="mb-3">
                                <strong>{comment.author}:</strong> {comment.text}
                            </div>
                        ))}
                        <form className="mt-3">
                            <div className="mb-3">
                                <textarea className="form-control" rows="3" placeholder="Add a comment"></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">Post Comment</button>
                        </form>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Home;
