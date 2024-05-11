import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [systemCounts, setSystemCounts] = useState(null);
    const [topPosts, setTopPosts] = useState([]);
    const [topBloggers, setTopBloggers] = useState([]);
    const [monthlyTopPosts, setMonthlyTopPosts] = useState([]);
    const [dailyActivity, setDailyActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [year, setYear] = useState(null);
    const [month, setMonth] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [systemCountsResponse, topPostsResponse, topBloggersResponse] = await Promise.all([
                    axios.get('https://localhost:7274/api/Admin/all-time'),
                    axios.get('https://localhost:7274/api/Admin/all-time-10-blogs'),
                    axios.get('https://localhost:7274/api/Admin/top-bloggers-10'),
                ]);
                setSystemCounts(systemCountsResponse.data);
                setTopPosts(topPostsResponse.data);
                setTopBloggers(topBloggersResponse.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchMonthlyTopPosts = async () => {
            try {
                if (year && month) {
                    setLoading(true);
                    const response = await axios.get(`https://localhost:7274/api/Admin/monthly-10-blogs?year=${year}&month=${month}`);
                    setMonthlyTopPosts(response.data);
                    setLoading(false);
                }
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchMonthlyTopPosts();
    }, [year, month]);

    useEffect(() => {
        const fetchDailyActivity = async () => {
            try {
                if (year && month) {
                    setLoading(true);
                    const response = await axios.get(`https://localhost:7274/api/monthly-daily-activity?month=${month}&year=${year}`);
                    setDailyActivity(response.data);
                    setLoading(false);
                }
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchDailyActivity();
    }, [year, month]);

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        if (name === 'year') {
            setYear(value);
        } else if (name === 'month') {
            setMonth(value);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!systemCounts || topPosts.length === 0 || topBloggers.length === 0) return null;

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return (
        <div className="container mt-5">
            <div className="row">
                {/* System Counts */}
                <div className="col-md-6 mb-4">
                    <div className="card border-primary h-100">
                        <div className="card-body">
                            <h2 className="card-title text-primary mb-4">System Counts</h2>
                            <p className="card-text"><strong>Total Blog Posts:</strong> {systemCounts.totalBlogPosts}</p>
                            <p className="card-text"><strong>Total Upvotes:</strong> {systemCounts.totalUpvotes}</p>
                            <p className="card-text"><strong>Total Downvotes:</strong> {systemCounts.totalDownvotes}</p>
                            <p className="card-text"><strong>Total Comments:</strong> {systemCounts.totalComments}</p>
                        </div>
                    </div>
                </div>
                {/* Top 10 Blog Posts */}
                <div className="col-md-6 mb-4">
                    <div className="card border-success h-100">
                        <div className="card-body">
                            <h2 className="card-title text-success mb-4">Top 10 Blog Posts</h2>
                            <ul className="list-group">
                                {topPosts.map(post => (
                                    <li key={post.postId} className="list-group-item">
                                        <h3>{post.title}</h3>
                                        <p><strong>Total Upvotes:</strong> {post.totalUpvotes}</p>
                                        <p><strong>Total Downvotes:</strong> {post.totalDownvotes}</p>
                                        <p><strong>Total Comments:</strong> {post.totalComments}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                {/* Monthly Top 10 Blog Posts */}
                <div className="col-md-6 mb-4">
                    <div className="card border-warning h-100">
                        <div className="card-body">
                            <h2 className="card-title text-warning mb-4">Monthly Top 10 Blog Posts</h2>
                            <div className="form-group">
                                <label htmlFor="year">Select Year:</label>
                                <select name="year" id="year" className="form-control" onChange={handleSelectChange}>
                                    <option value="">Select Year</option>
                                    {Array.from({ length: 30 }, (_, i) => (
                                        <option key={2000 + i} value={2000 + i}>{2000 + i}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="month">Select Month:</label>
                                <select name="month" id="month" className="form-control" onChange={handleSelectChange}>
                                    <option value="">Select Month</option>
                                    {monthNames.map((month, index) => (
                                        <option key={index + 1} value={index + 1}>{month}</option>
                                    ))}
                                </select>
                            </div>
                            {monthlyTopPosts.length > 0 ? (
                                <ul className="list-group">
                                    {monthlyTopPosts.map(post => (
                                        <li key={post.postId} className="list-group-item">
                                            <h3>{post.title}</h3>
                                            <p><strong>Total Upvotes:</strong> {post.totalUpvotes}</p>
                                            <p><strong>Total Downvotes:</strong> {post.totalDownvotes}</p>
                                            <p><strong>Total Comments:</strong> {post.totalComments}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="mt-4">No data available for the selected month and year</p>
                            )}
                        </div>
                    </div>
                </div>
                {/* Monthly Daily Activity */}
                <div className="col-md-6">
                    <div className="card border-info h-100">
                        <div className="card-body">
                            <h2 className="card-title text-info mb-4">Monthly Daily Activity</h2>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="month">Select Month:</label>
                                    <select name="month" id="month" className="form-control" onChange={handleSelectChange}>
                                        <option value="">Select Month</option>
                                        {monthNames.map((month, index) => (
                                            <option key={index + 1} value={index + 1}>{month}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="year">Select Year:</label>
                                    <select name="year" id="year" className="form-control" onChange={handleSelectChange}>
                                        <option value="">Select Year</option>
                                        {Array.from({ length: 30 }, (_, i) => (
                                            <option key={2000 + i} value={2000 + i}>{2000 + i}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <ul className="list-group">
                                {dailyActivity.map((activity, index) => (
                                    <li key={index} className="list-group-item">
                                        <div><strong>Date:</strong> {activity.date}</div>
                                        <div><strong>Blog Post Count:</strong> {activity.blogPostCount}</div>
                                        <div><strong>Upvote Count:</strong> {activity.upvoteCount}</div>
                                        <div><strong>Downvote Count:</strong> {activity.downvoteCount}</div>
                                        <div><strong>Comment Count:</strong> {activity.commentCount}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {/* Top 10 Bloggers */}
            <div className="row mt-4">
                <div className="col">
                    <div className="card border-info">
                        <div className="card-body">
                            <h2 className="card-title text-info">Top 10 Bloggers</h2>
                            <ul className="list-group">
                                {topBloggers.map(blogger => (
                                    <li key={blogger.userId} className="list-group-item">
                                        <h3>{blogger.username}</h3>
                                        <p><strong>Total Posts:</strong> {blogger.totalPosts}</p>
                                        <p><strong>Total Upvotes Received:</strong> {blogger.totalUpvotesReceived}</p>
                                        <p><strong>Total Comments Received:</strong> {blogger.totalCommentsReceived}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;