const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {User} = require("../models/User");

const router = express.Router();


/* LOGIN */
router.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email, case-insensitively.
    // It's common for email fields in a database schema to be set to lowercase.
    // This ensures that a search for 'Test@email.com' finds the user 'test@email.com'.
    // We must explicitly select the password, as it's likely excluded by default in the User model for security.
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      // Return a generic error to prevent attackers from knowing if a user email exists (user enumeration).
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    next(err);
  }
});

module.exports = { login: router };