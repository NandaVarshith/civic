const express = require("express");
const bcrypt = require("bcryptjs");
const {User} = require("../models/User");

const router = express.Router();

/* REGISTER */
router.post("/", async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
});

/**profile **/
router.get('/',(req,res)=>{});

//update profile
router.put('/',(req,res)=>{});

//delete profile
router.delete('/',(req,res)=>{});


module.exports = {UserRouter: router};