const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
   res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
   });
   res.status(200).json({ message: "logout successful" });
});

module.exports = { logout: router };