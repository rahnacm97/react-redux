const User = require("../Models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
//const env = require("dotenv").config();

//User registration
const userSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email: email });
    if (existing) {
      return res.status(409).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      msg: "User signup successfully",
      token,
      user: { _id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.log("Server error", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

//User Login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Password does not match" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      msg: "User logged in successfully",
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.log("User login error", error);
    return res.status(500).json({ msg: "User login error" });
  }
};

//User user profile
const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.log("User data fetching error", error);
    res.status(500).json({ msg: "Server error" });
  }
};

//Editing user data
const updateProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    const updateData = {
      name: req.body.name,
      email: req.body.email,
      profilePic: req.file ? req.file.filename : user.profilePic,
    };

    const updateUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updateUser) {
      return res.status(400).json({ msg: "User not found" });
    }

    return res.status(200).json({
      msg: "Profile updated successfully",
      user: updateUser,
    });
  } catch (error) {
    // console.error("profile updating error", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

//Get user data
const getUserData = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    // console.log('User data fetching error in header',error)
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const takeUserData = async(req,res)=>{
  try {
    const {id} = req.params
     const user = await User.findById(id);
   if(!user){
    return res.status(400).json({msg:'User not found'})
   }
   return res.status(200).json({msg:"User data taken successfully",user})
  } catch (error) {
   console.log('user data taking error',error);
  }
}

module.exports = {
  userSignup,
  userLogin,
  getUserProfile,
  updateProfile,
  getUserData,
  takeUserData,
};
