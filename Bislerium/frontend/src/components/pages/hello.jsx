import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import TextInput from "../Common/TextInput";
import { toast } from "react-toastify";
const Hello = () => {
  const [updateData, setUpdateData] = useState({
    imageName: "",
    imageSrc: "hello",
    imageFile: null,
  });
  const addButton = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("imageName", updateData.imageName);
      formData.append("imageFile", updateData.imageFile);

      const respones = await axios.post(
        "https://localhost:7274/api/EmployeeModels/",
        formData
      );
      console.log("Hello");
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleUpdateFile = (e) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (x) => {
        setUpdateData({
          ...updateData,
          imageName: imageFile.name,
          imageFile: imageFile,
          imageSrc: x.target.result,
        });
      };

      reader.readAsDataURL(imageFile);
    }
  };
  return (
    <>
      <form autoComplete="off" noValidate onSubmit={addButton}>
        <div className="card">
          <div className="card-body">
            <div className="form-group">
              <input
                type="file"
                accept="image/*"
                className={"form-control-file"}
                onChange={handleUpdateFile}
                id="image-uploader"
              />
            </div>
            <div className="form-group text-center">
              <button type="submit" className="btn btn-light">
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Hello;
