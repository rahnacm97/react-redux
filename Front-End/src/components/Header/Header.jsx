import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/userSlice";
import api from "../../api/api";
import Swal from "sweetalert2";

//User Header fn
function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userData, setData] = useState(null);
  const { user } = useSelector((state) => state.user);

  //Check user logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  //Get user
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = user?.user?._id;

    if (userId && token) {
      const fetchUserData = async () => {
        try {
          const response = await api.get(`/auth/userdata/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setData(response.data);
        } catch (error) {
          if (error.response?.status === 400 && error.response?.data?.msg === "User not found") {
            Swal.fire({
              icon: "error",
              title: "Account Deleted",
              text: "Your account has been deleted by an admin.",
              confirmButtonText: "OK",
            }).then(() => {
              dispatch(logoutUser());
              localStorage.removeItem("user");
              localStorage.removeItem("token");
              navigate("/");
            });
          } else {
            console.log("Header user data getting error", error);
          }
        }
      };

      fetchUserData();

      const intervalId = setInterval(fetchUserData, 10000);

      // Cleanup
      return () => clearInterval(intervalId);
    } else {
      setData(null);
    }
  }, [user?.user?._id, dispatch, navigate]);

  //Logging out
  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleProfile = () => {
    if (user && user?.user?._id) {
      navigate(`/profile/${user?.user?._id}`);
    }
  };

  return (
    <div className="top-bar">
      <div className="profile-icon">
        <img
          src={
            userData?.user?.profilePic?.length
              ? `http://localhost:3000/Uploads/${userData?.user?.profilePic[0]}`
              : "/default-profile"
          }
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      </div>

      <div className="action-buttons">
        <button className="logout-button" onClick={handleLogout}>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Header;