const express = require('express');
const router =express.Router();
const bcrypt = require('bcryptjs');
const {User} = require('../models/User');



/* REGISTER */
router.post("/", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = {RegisterRouter: router};