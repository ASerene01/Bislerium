import React, { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Card, Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import TextInput from "../Common/TextInput";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { Pie } from "react-chartjs-2";

const Dashboard = () => {
  const [systemCounts, setSystemCounts] = useState(null);
  const [topPosts, setTopPosts] = useState([]);
  const [topBloggers, setTopBloggers] = useState([]);
  const [monthlyTopPosts, setMonthlyTopPosts] = useState([]);
  const [dailyActivity, setDailyActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [showActivity, setShowActivity] = useState(false); // Flag to control activity display

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [systemCountsResponse, topPostsResponse, topBloggersResponse] =
          await Promise.all([
            axios.get("https://localhost:7274/api/Admin/all-time"),
            axios.get("https://localhost:7274/api/Admin/all-time-10-blogs"),
            axios.get("https://localhost:7274/api/Admin/top-bloggers-10"),
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
    const fetchDailyActivity = async () => {
      try {
        if (selectedYear && selectedMonth) {
          setLoading(true);
          const response = await axios.get(
            `https://localhost:7274/api/Admin/monthly-daily-activity?Year=${selectedYear}&Month=${selectedMonth}`
          );
          setDailyActivity(response.data);
          console.log(dailyActivity);
          setShowActivity(true); // Set flag to true when data is fetched
          setLoading(false);
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (selectedYear && selectedMonth) {
      fetchDailyActivity();
    }
  }, [selectedYear, selectedMonth]);

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    if (name === "year") {
      setSelectedYear(value);
    } else if (name === "month") {
      setSelectedMonth(value);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!systemCounts || topPosts.length === 0 || topBloggers.length === 0)
    return null;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="container-fluid mt-4 d-flex flex-column gap-2">
      <h1 className="text-center mb-4 text-white">Admin Dashboard</h1>

      <Row>
        <Col md={6} className="mb-4 rounded-5">
          {/* Top 10 Bloggers Pie Chart */}
          <Card>
            <Card.Body className="rounded-5">
              <Card.Title className="text-center">Top 10 Bloggers</Card.Title>
              <Pie
                width={400}
                height={100}
                data={{
                  labels: topBloggers.map(
                    (blogger) => `${blogger.firstName} ${blogger.lastName}`
                  ),
                  datasets: [
                    {
                      label: "Top Bloggers",
                      backgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#8B008B",
                        "#FF4500",
                        "#4B0082",
                        "#00CED1",
                        "#32CD32",
                        "#800080",
                        "#FFD700",
                      ],
                      hoverBackgroundColor: [
                        "#FF6384",
                        "#36A2EB",
                        "#FFCE56",
                        "#8B008B",
                        "#FF4500",
                        "#4B0082",
                        "#00CED1",
                        "#32CD32",
                        "#800080",
                        "#FFD700",
                      ],
                      data: topBloggers.map((blogger) => blogger.totalPosts),
                    },
                  ],
                }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4 rounded-5">
          {/* All-Time Stats Bar Chart */}
          <Card>
            <Card.Body>
              <Card.Title className="white text-center">
                All-Time Stats
              </Card.Title>
              <Bar
                data={{
                  labels: [
                    "Total Blog Posts",
                    "Total Upvotes",
                    "Total Downvotes",
                    "Total Comments",
                  ],
                  datasets: [
                    {
                      label: "Count",
                      backgroundColor: [
                        "rgba(255, 99, 132, 0.6)",
                        "rgba(54, 162, 235, 0.6)",
                        "rgba(255, 206, 86, 0.6)",
                        "rgba(75, 192, 192, 0.6)",
                      ],
                      borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                      ],
                      borderWidth: 1,
                      data: [
                        systemCounts.totalBlogPosts,
                        systemCounts.totalComments,
                        systemCounts.totalDownvotes,
                        systemCounts.totalUpvotes,
                      ],
                    },
                  ],
                }}
                options={{
                  scales: {
                    yAxes: [
                      {
                        ticks: { beginAtZero: true },
                      },
                    ],
                  },
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Daily Activity for the Month */}
      {selectedMonth && selectedYear && showActivity && (
        <Row>
          <Col md={12} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title className="text-center">
                  Daily Activity for the Month
                </Card.Title>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Blog Post Count</th>
                      <th>Upvote Count</th>
                      <th>Downvote Count</th>
                      <th>Comment Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailyActivity.map((activity, index) => (
                      <tr key={index}>
                        <td>{new Date(activity.date).toLocaleDateString()}</td>
                        <td>{activity.blogPostCount}</td>
                        <td>{activity.upvoteCount}</td>
                        <td>{activity.downvoteCount}</td>
                        <td>{activity.commentCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Month and Year selection */}
      <Row>
        <Col md={12} className="mb-4">
          <Card>
            <Card.Body>
              <div className="form-group col-md-6">
                <label htmlFor="month">Select Month:</label>
                <select
                  name="month"
                  id="month"
                  className="form-control"
                  onChange={handleSelectChange}
                >
                  <option value="">Select Month</option>
                  {monthNames.map((month, index) => (
                    <option key={index + 1} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="year">Select Year:</label>
                <select
                  name="year"
                  id="year"
                  className="form-control"
                  onChange={handleSelectChange}
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 30 }, (_, i) => (
                    <option key={2000 + i} value={2000 + i}>
                      {2000 + i}
                    </option>
                  ))}
                </select>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
