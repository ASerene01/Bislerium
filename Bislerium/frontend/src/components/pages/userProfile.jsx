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
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState("");
  //  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
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
    } catch (error) {
      console.error(error.response);
      setError("User Not Deleted");
    }
  };

  const handleChangePassword = async () => {
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
      console.log(response);
      alert("Password Changed Successfully");
    } catch (error) {
      console.error(error.response);
      setError("Password Change Failed");
    }
  };
  //   console.table("user", user);
  return (
    <>
      <div className="d-flex justify-content-center  ">
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
        </div>
      </div>
    </>
  );
};

export default UserProfile;
