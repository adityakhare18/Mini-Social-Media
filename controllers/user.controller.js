const express = require("express");
const app = express();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");

const registerUser = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;

    const isPresent = await userModel.findOne({ email });
    if (isPresent) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullname,
      username,
      email,
      password: hashPassword,
    });

    const token = jwt.sign({ email, id: user._id }, "secret");

    res.cookie("token", token);

    return res.status(201).json({ msg: "User created successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(500).json({msg:"User not found"});
    //   return res.redirect("/");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Email or Password is wrong" });
    }

    const token = jwt.sign({ email, id: user._id }, "secret");

    res.cookie("token", token);

    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

const logoutUser = (req,res) =>{
    res.clearCookie("token");
    res.redirect('/login');
}


// const userProfile = async (req,res) => {
//     const user = await userModel.findOne({email:req.user.email});
//     if(!user){
//         return res.status(500).json({msg:"User not found"});
//     }
//     await user.populate("posts");
//     res.render('profile',{user});
// }

const userProfile = async (req, res) => {
  const user = await userModel.findOne({ email: req.user.email });
  if (!user) {
    return res.status(500).json({ msg: "User not found" });
  }

  await user.populate("posts"); // ✅ await this
  res.render("profile", { user });
};


module.exports = { registerUser, loginUser, logoutUser,userProfile };
