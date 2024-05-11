import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import TextInput from "../Common/TextInput";
import { useNavigate } from "react-router-dom";
import Avatar from "../Common/Avatar";

const UserProfile = () => {
  const { user, isLoggedIn, handleLogout } = useAuth();
  const token = localStorage.getItem("token");
  const [userDetails, setUserDetails] = useState(null);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [updateData, setUpdateData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    userName: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7274/api/User/GetUser",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, []); // <-- Add token as a dependency

  const handleDelete = async () => {
    //blogId.preventDefault();

    try {
      const response = await axios.delete(
        `https://localhost:7274/api/User/DeleteUser`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("User Deleted Sucessfully");
      handleLogout();
      navigate(0);
    } catch (error) {
      console.error(error.response);
      setError("User Not Deleted");
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `https://localhost:7274/api/User/UpdateUser`,
        {
          firstName: updateData.firstName,
          lastName: updateData.lastName,
          email: updateData.email,
          phoneNumber: updateData.phoneNumber,
          userName: updateData.userName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        navigate(0);
        console.log("Successful");
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error(error.response);
      setError("Update failed. Please try again later.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      console.log(user.userId);
      const response = await axios.post(
        "https://localhost:7274/api/Auth/change-password",
        {
          userId: user.UserId,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      handleLogout();
    } catch (error) {
      console.error(error.response);
      setError("Password Change Failed");
    }
  };
  //   console.table("user", user);
  return (
    <>
      <div className="d-flex justify-content-center  ">
        {userDetails ? (
          <section
            className="w-100 px-4 py-5"
            style={{
              backgroundColor: "#27262C",
              borderRadius: ".5rem .5rem 0 0",
            }}
          >
            <div className="row d-flex justify-content-center">
              <div className="col col-md-9 col-lg-7 col-xl-6">
                <div className="card" style={{ borderRadius: "15px" }}>
                  <div className="card-body p-4">
                    <div className="d-flex">
                      <div className="flex-shrink-0">
                        <img
                          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-1.webp"
                          alt="Generic placeholder image"
                          className="img-fluid"
                          style={{ width: "180px", borderRadius: "10px" }}
                        />
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <h5 className="mb-1">
                          {userDetails.firstName} {userDetails.lastName}
                        </h5>
                        <p className="mb-2 pb-1">{userDetails.userName}</p>
                        <p className="mb-2 pb-1">{userDetails.email}</p>
                        <p className="mb-2 pb-1">{userDetails.phoneNumber}</p>

                        <div className="d-flex pt-1">
                          <button
                            type="button"
                            className="btn btn-outline-primary me-1 flex-grow-1"
                            data-bs-toggle="modal"
                            data-bs-target="#updateModal"
                            onClick={() =>
                              setUpdateData({
                                firstName: userDetails.firstName,
                                lastName: userDetails.lastName,
                                email: userDetails.email,
                                phoneNumber: userDetails.phoneNumber,
                                userName: userDetails.userName,
                              })
                            }
                          >
                            Edit Profile
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-primary me-1 flex-grow-1"
                            data-bs-toggle="modal"
                            data-bs-target="#exampleModal"
                          >
                            Change Password
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-primary me-1 flex-grow-1"
                            onClick={() => handleDelete()}
                          >
                            Delete
                          </button>
                        </div>
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
                                <h1
                                  className="modal-title fs-5"
                                  id="exampleModalLabel"
                                >
                                  Change Password
                                </h1>
                                <button
                                  type="button"
                                  className="btn-close"
                                  data-bs-dismiss="modal"
                                  aria-label="Close"
                                ></button>
                              </div>
                              <form onSubmit={handleChangePassword}>
                                <div className="modal-body">
                                  <div className="mb-3">
                                    <TextInput
                                      type="text"
                                      name="currentPassword"
                                      value={formData.currentPassword}
                                      onChange={handleChange}
                                      placeholder="CurrentPassword"
                                    />
                                  </div>
                                  <div className="mb-3">
                                    <TextInput
                                      type="text"
                                      name="newPassword"
                                      value={formData.newPassword}
                                      onChange={handleChange}
                                      placeholder="New Password"
                                    />
                                  </div>
                                </div>
                                <div className="modal-footer">
                                  <button className="btn btn-primary">
                                    Change Password
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                        {/* Update User Modal */}
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
                                <h1
                                  className="modal-title fs-5"
                                  id="exampleModalLabel"
                                >
                                  Update User
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
                                      value={updateData.firstName}
                                      onChange={(e) =>
                                        setUpdateData({
                                          ...updateData,
                                          firstName: e.target.value,
                                        })
                                      }
                                      placeholder="First Name"
                                    />
                                  </div>
                                  <div className="mb-3">
                                    <TextInput
                                      type="text"
                                      name="body"
                                      value={updateData.lastName}
                                      onChange={(e) =>
                                        setUpdateData({
                                          ...updateData,
                                          lastName: e.target.value,
                                        })
                                      }
                                      placeholder="Last Name"
                                    />
                                  </div>
                                  <div className="mb-3">
                                    <TextInput
                                      type="text"
                                      name="body"
                                      value={updateData.email}
                                      onChange={(e) =>
                                        setUpdateData({
                                          ...updateData,
                                          email: e.target.value,
                                        })
                                      }
                                      placeholder="Email"
                                    />
                                  </div>
                                  <div className="mb-3">
                                    <TextInput
                                      type="text"
                                      name="body"
                                      value={updateData.phoneNumber}
                                      onChange={(e) =>
                                        setUpdateData({
                                          ...updateData,
                                          phoneNumber: e.target.value,
                                        })
                                      }
                                      placeholder="Phone Number"
                                    />
                                  </div>
                                  <div className="mb-3">
                                    <TextInput
                                      type="text"
                                      name="body"
                                      value={updateData.userName}
                                      onChange={(e) =>
                                        setUpdateData({
                                          ...updateData,
                                          userName: e.target.value,
                                        })
                                      }
                                      placeholder="UserName"
                                    />
                                  </div>
                                </div>
                                <div className="modal-footer">
                                  <button className="btn btn-primary">
                                    Update User
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
              </div>
            </div>
          </section>
        ) : (
          <p>Loading user details...</p>
        )}
        {/*
        <div className="card" style={{ width: "18rem" }}>
          <div className="card-img-top">
            <Avatar />
            <div />
            <div className="card-body">
              <h5 className="card-title">
                {user.FirstName} {user.LastName}
              </h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
              >
                Change Password
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleDelete()}
              >
                Delete
              </button>

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
                        Change Password
                      </h1>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <form onSubmit={handleChangePassword}>
                      <div className="modal-body">
                        <div className="mb-3">
                          <TextInput
                            type="text"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder="CurrentPassword"
                          />
                        </div>
                        <div className="mb-3">
                          <TextInput
                            type="text"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="New Password"
                          />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button className="btn btn-primary">
                          Change Password
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div />
        </div>*/}
      </div>
    </>
  );
};

export default UserProfile;
