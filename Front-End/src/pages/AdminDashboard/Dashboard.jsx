
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import api from "../../api/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/adminHeader/adminHeader";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [editErrors, setEditErrors] = useState({ name: "", email: "" });
  const [newModal, setNewModal] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", name: "", password: "", confirmPassword: "" });
  const [error, setError] = useState({ email: "", name: "", password: "", confirmPassword: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [userDatas, setUserDatas] = useState([]);

  // Edit button
  const handleEditClick = (user) => {
    setEditUser(user);
    setFormData({ name: user.name, email: user.email });
    setEditErrors({ name: "", email: "" });
    setModalOpen(true);
  };

  const handleClose = () => setModalOpen(false);

  const closeNewModal = () => {
    setNewModal(false);
    setNewUser({ email: "", name: "", password: "", confirmPassword: "" });
    setError({ email: "", name: "", password: "", confirmPassword: "" });
  };

  // Not admin, go back to login
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    if (!admin) {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  // Fetch users only if admin is authenticated
  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = localStorage.getItem("token");
    if (admin && token) {
      fetchUser();
    }
  }, []);

  // User fetch
  const fetchUser = () => {
    const token = localStorage.getItem("token");
    api
      .get("/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserDatas(response.data.userData);
      })
      .catch((error) => {
        console.log("user data fetching error", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("admin");
          localStorage.removeItem("token");
          navigate("/admin/login", { replace: true });
          return;
        }
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.msg || "Failed to fetch users",
          confirmButtonText: "OK",
        });
      });
  };

  // Delete user
  const deleteuser = (userId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await api.delete(`/admin/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserDatas((prevUserDatas) =>
            prevUserDatas.filter((user) => user._id !== userId)
          );
          Swal.fire({
            icon: "success",
            title: "Success",
            text: res.data.msg || "User deleted successfully",
            confirmButtonText: "OK",
          });
        } catch (error) {
          console.log("User deleting error", error);
          if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem("admin");
            localStorage.removeItem("token");
            navigate("/admin/login", { replace: true });
            return;
          }
          Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response?.data?.msg || "Failed to delete user",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  // Validation
  const validateEdit = () => {
    let isValid = true;
    const newError = { name: "", email: "" };
    const namePattern = /^[A-Za-z]+[A-Za-z ]*$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!formData.name) {
      newError.name = "Name is required";
      isValid = false;
    } else if (!namePattern.test(formData.name)) {
      newError.name = "Name should contain only letters and spaces, with at least one letter";
      isValid = false;
    } else if (formData.name.trim().length === 0) {
      newError.name = "Name cannot be only spaces";
      isValid = false;
    }

    if (!formData.email) {
      newError.email = "Email is required";
      isValid = false;
    } else if (!emailPattern.test(formData.email)) {
      newError.email = "Please enter a valid email address";
      isValid = false;
    }

    setEditErrors(newError);
    return isValid;
  };

  // Save data
  const handleSave = async () => {
    if (validateEdit()) {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin/login", { replace: true });
        return;
      }
      try {
        const response = await api.put(`/admin/users/${editUser._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.msg || "User updated successfully",
          confirmButtonText: "OK",
        });
        setModalOpen(false);
        fetchUser();
      } catch (error) {
        console.log("user updating error", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("admin");
          localStorage.removeItem("token");
          navigate("/admin/login", { replace: true });
          return;
        }
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.msg || "Failed to update user",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleNewModal = () => {
    setNewModal(true);
    setError({ email: "", name: "", password: "", confirmPassword: "" });
  };

  const validateNewUser = () => {
    let isValid = true;
    const newError = { email: "", name: "", password: "", confirmPassword: "" };
    const namePattern = /^[A-Za-z]+[A-Za-z ]*$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!newUser.name) {
      newError.name = "Name is required";
      isValid = false;
    } else if (!namePattern.test(newUser.name)) {
      newError.name = "Name should contain only letters and spaces, with at least one letter";
      isValid = false;
    } else if (newUser.name.trim().length === 0) {
      newError.name = "Name cannot be only spaces";
      isValid = false;
    }

    if (!newUser.email) {
      newError.email = "Email is required";
      isValid = false;
    } else if (!emailPattern.test(newUser.email)) {
      newError.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!newUser.password) {
      newError.password = "Password is required";
      isValid = false;
    } else if (newUser.password.length < 8) {
      newError.password = "Password must be at least 8 characters long";
      isValid = false;
    }

    if (!newUser.confirmPassword) {
      newError.confirmPassword = "Confirm Password is required";
      isValid = false;
    } else if (newUser.password !== newUser.confirmPassword) {
      newError.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  // Adding New user
  const handleNewUserSave = async (e) => {
    e.preventDefault();
    if (validateNewUser()) {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin/login", { replace: true });
        return;
      }
      try {
        const response = await api.post(
          "/admin/users",
          {
            name: newUser.name,
            email: newUser.email,
            password: newUser.password,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserDatas((prevUserDatas) => [
          ...prevUserDatas,
          {
            _id: response.data.user._id,
            name: response.data.user.name,
            email: response.data.user.email,
            createdAt: response.data.user.createdAt || new Date().toISOString(),
            profilePic: response.data.user.profilePic || [],
          },
        ]);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.msg || "User added successfully",
          confirmButtonText: "OK",
        });
        setNewModal(false);
        setNewUser({ email: "", name: "", password: "", confirmPassword: "" });
      } catch (error) {
        console.log("Error adding new user:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("admin");
          localStorage.removeItem("token");
          navigate("/admin/login", { replace: true });
          return;
        }
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || error.response?.data?.msg || "Failed to add user",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const filterUserData = userDatas.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <div className="main-content">
        <AdminHeader />
        <div className="dashboard-content">
          <div className="content-card">
            <div className="card-header">
              <h3>User List</h3>
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="search-button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="search-icon"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              </div>
              <button className="add-user" onClick={handleNewModal}>
                Add User
              </button>
            </div>
            <div className="table-container">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>User Profile</th>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Created At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(searchQuery ? filterUserData : userDatas).map((users) => (
                    <tr key={users._id}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            <img
                              src={
                                users?.profilePic?.length
                                  ? `http://localhost:3000/Uploads/${users.profilePic[0]}`
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
                        </div>
                      </td>
                      <td><span>{users?.name}</span></td>
                      <td>{users?.email}</td>
                      <td>{new Date(users?.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-btn"
                            onClick={() => handleEditClick(users)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => deleteuser(users._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={handleClose}>×</button>
            <h3 className="modal-title">Edit Profile</h3>
            <form>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                {editErrors.name && <p style={{ color: "red" }}>{editErrors.name}</p>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {editErrors.email && <p style={{ color: "red" }}>{editErrors.email}</p>}
              </div>
            </form>
            <div className="button-group">
              <button className="cancel-button" onClick={handleClose}>Cancel</button>
              <button className="save-button" onClick={handleSave}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
      {newModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeNewModal}>×</button>
            <h3 className="modal-title">Add New User</h3>
            <form>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />
                {error.name && <p style={{ color: "red" }}>{error.name}</p>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
                {error.email && <p style={{ color: "red" }}>{error.email}</p>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
                {error.password && <p style={{ color: "red" }}>{error.password}</p>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-input"
                  value={newUser.confirmPassword}
                  onChange={(e) =>
                    setNewUser({ ...newUser, confirmPassword: e.target.value })
                  }
                />
                {error.confirmPassword && <p style={{ color: "red" }}>{error.confirmPassword}</p>}
              </div>
            </form>
            <div className="button-group">
              <button className="cancel-button" onClick={closeNewModal}>Cancel</button>
              <button className="save-button" onClick={handleNewUserSave}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;