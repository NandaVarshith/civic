const express = require('express');
const router =express.Router();
const bcrypt = require('bcryptjs');
const {User} = require('../models/User');



/* REGISTER */
router.post("/", async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    const allowedRoles = ["user", "worker"];
    const normalizedRole = allowedRoles.includes(role) ? role : "user";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: normalizedRole,
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully", role: user.role });
  } catch (err) {
    next(err);
  }
});

module.exports = {RegisterRouter: router};
