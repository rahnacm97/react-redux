import "./UserProfile.css";
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import Header from "../../components/Header/Header";
import { useSelector } from "react-redux";
import Swal from 'sweetalert2';

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedfile, setSelectedFile] = useState(null);
  const [errors, setErrors] = useState({ name: "", email: "" });
  const { user } = useSelector((state) => state.user.user);

  useEffect(() => {
    if (userData) {
      setName(userData.user.name);
      setEmail(userData.user.email);
      setErrors({ name: "", email: "" }); // Reset errors when userData changes
    }
  }, [userData]);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (id) {
      api.get(`/auth/profile/${id}`)
        .then(response => {
          setUserData(response.data);
          setName(response.data.user.name);
          setEmail(response.data.user.email);
        }).catch(error => {
          console.log('user data fetching error', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.msg || 'Failed to fetch user data',
          });
        });
    }
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const validate = () => {
    let isValid = true;
    const newError = { name: "", email: "" };
    const namePattern = /^[A-Za-z]+[A-Za-z ]*$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!name) {
      newError.name = "Name is required";
      isValid = false;
    } else if (!namePattern.test(name)) {
      newError.name = "Name should contain only letters and spaces, with at least one letter";
      isValid = false;
    } else if (name.trim().length === 0) {
      newError.name = "Name cannot be only spaces";
      isValid = false;
    }

    if (!email) {
      newError.email = "Email is required";
      isValid = false;
    } else if (!emailPattern.test(email)) {
      newError.email = "Please enter a valid email address";
      isValid = false;
    }

    setErrors(newError);
    return isValid;
  };

  const handleSaveProfile = async () => {
    if (validate()) {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('name', name);
      if (selectedfile) {
        formData.append('profilePic', selectedfile);
      }
      try {
        const response = await api.post(`/auth/profile/update/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setUserData(response.data);
        setSelectedFile(null);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User profile updated successfully!',
          confirmButtonColor: '#3b82f6',
        });
        navigate('/home');
      } catch (error) {
        console.log('user profile updating error', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.msg || 'Failed to update user profile',
        });
      }
    }
  };

  return (
    <>
      <div>
        <Header />
      </div>
      <div className="user-profile-container">
        <div className="profile-header">
          <div className="profile-pic-container">
            {userData?.user?.profilePic ? (
              <img
                src={`http://localhost:3000/Uploads/${userData?.user?.profilePic?.[0]}`}
                alt="Profile"
                className="profile-pic"
              />
            ) : (
              <div className="profile-pic-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            )}

            <label htmlFor="profile-upload" className="profile-pic-upload">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
              <input
                type="file"
                id="profile-upload"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>

            {selectedfile && (
              <p className="file-name">Selected file: {selectedfile.name}</p>
            )}
          </div>
        </div>

        <div className="profile-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>

          <button type="button" onClick={handleSaveProfile} className="save-button">
            Save Profile
          </button>
        </div>
      </div>
    </>
  );
};

export default UserProfile;