import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../features/userSlice';
import api from '../../api/api';
import Swal from 'sweetalert2';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userData, setData] = useState(null);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = user?.user?._id;

    if (userId && token) {
      api
        .get(`/auth/userdata/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.log('header user data getting error', error);
          if (error.response?.status === 400 && error.response?.data?.msg === 'User not found') {
            Swal.fire({
              icon: 'error',
              title: 'Account Deleted',
              text: 'Your account has been deleted. Please contact support.',
              confirmButtonColor: '#3b82f6',
            });
            dispatch(logoutUser());
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            navigate('/login');
          }
        });
    } else {
      setData(null);
    }
  }, [user?.user?._id, dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
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
              ? `http://localhost:3000/Uploads/${userData.user.profilePic[0]}`
              : '/default-profile'
          }
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
          onError={(e) => {
            e.target.src = defaultProfile; // Fallback if uploaded image fails
          }}
        />
      </div>

      <div className="action-buttons">
        {/* <button className="profile-button" onClick={handleProfile} aria-label="View profile">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="profile-icon-svg"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button> */}

        <button className="logout-button" onClick={handleLogout}>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Header;