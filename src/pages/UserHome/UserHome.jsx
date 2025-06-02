import React, { useEffect, useState } from "react";
import "./UserHome.css";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import Swal from "sweetalert2";
import { logoutUser } from "../../features/userSlice";
import Header from "../../components/Header/Header";

function UserHome() {
  const { user } = useSelector((state) => state.user.user || {});
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Check if user is logged in
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    if (!user && !localUser) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?._id) return;

      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/auth/users/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(res.data.user);
      } catch (error) {
        if (
          error.response?.status === 400 &&
          error.response?.data?.msg === "User not found"
        ) {
          Swal.fire({
            icon: "error",
            title: "Account Deleted",
            text: "Your account has been deleted by admin.",
            confirmButtonText: "OK",
          }).then(() => {
            dispatch(logoutUser());
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            navigate("/");
          });
        } else {
          console.log("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();

    const intervalId = setInterval(fetchUserData, 10000);

    return () => clearInterval(intervalId);
  }, [user?._id, dispatch, navigate]);

  const handleProfile = () => {
    if (user && user?._id) {
      navigate(`/profile/${user._id}`);
    }
  };

  return (
    <>
      <Header />
      <div className="user-home-container">
        <div className="user-box">
          {userData?.profilePic && (
            <img
              src={
                userData?.profilePic?.length
                  ? `http://localhost:3000/Uploads/${userData.profilePic[0]}`
                  : "/default-profile"
              }
              alt="User Profile"
              className="user-profile-pic"
            />
          )}
          <h1 className="user-name">Welcome, {userData?.name || "User"}!</h1>
          <button className="edit-profile-button" onClick={handleProfile}>
            Edit Profile
          </button>
        </div>
      </div>
    </>
  );
}

export default UserHome;
