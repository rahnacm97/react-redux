const Admin = require("../Models/adminShema");
const User = require("../Models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//const env = require("dotenv").config();

//Admin Login
const AdminLoginPage = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(400).json({ msg: "Admin doesn't exists" });
    }
    if (admin.password !== password) {
      return res.status(400).json({ msg: "Password not match" });
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res
      .status(200)
      .json({
        msg: "Admin logged in successfully",
        admin: { _id: admin._id, email: admin.email },
        token,
      });
  } catch (error) {
    console.log("Admin login error", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

//Admin Fetching user data
const fetchingUserData = async (req, res) => {
  try {
    const userData = await User.find({});
    return res
      .status(200)
      .json({ msg: "User data fetched successfully", userData });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

//Delete User
const deleteuser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    return res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    //console.log('user deleting error',error)
    return res.status(500).json({ msg: "Internal server error" });
  }
};

//Edit user data
const userUpdate = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email } = req.body;
    const update = await User.findByIdAndUpdate(id, { name, email });
    return res.status(200).json({ msg: "User updated successfully" });
  } catch (error) {
    // console.log('User updating error',error)
    return res.status(500).json({ msg: "Server error" });
  }
};

//Adding new user
const addNewUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res
      .status(200)
      .json({ msg: "User added successfully", user: newUser });
  } catch (error) {
    console.error("New user adding error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  AdminLoginPage,
  fetchingUserData,
  deleteuser,
  userUpdate,
  addNewUser,
};
