const express = require("express");
const bcrypt = require("bcryptjs");
const {User} = require("../models/User");
const { auth } = require("../middlewares/authentication");

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
router.get('/',auth,async(req,res)=>{
  const user = req.user; // Assuming user is attached to req by auth middleware  
  const userData = await User.findById(user.userId).select('-password'); // Fetch user data without password
  res.status(200).json({
    name: userData.username,
    email: userData.email,
    role: userData.role,
    phone: userData.phone,
    profileImage: userData.profileImage,
    isActive: true,
  });
});

router.put('/password',auth,(req,res)=>{
  const {oldPassword, newPassword} = req.body;
  const userId = req.user.userId;
  User.findById(userId).select('+password').then((user)=>{
    bcrypt.compare(oldPassword, user.password).then(isMatch => {
      if (!isMatch) {
        return res.status(400).json({message: "Current password is incorrect"});
      }
      bcrypt.hash(newPassword, 12).then(hashedPassword => {
        User.findByIdAndUpdate(userId, {password: hashedPassword}, {new: true})
          .select('-password')
          .then(updatedUser => {
            res.status(200).json({message: "Password updated successfully"});
          })
          .catch(err => {
            res.status(500).json({message: "Failed to update password", error: err});
          });
      });
    });
  }).catch(err => {
    res.status(500).json({message: "Failed to retrieve user", error: err});
  });

});


//update profile
router.put('/updateprofile',auth,(req,res)=>{
  const {name, email, phone, profileImage} = req.body;
  const userId = req.user.userId;
  User.findByIdAndUpdate(userId, {username: name, email, phone, profileImage}, {new: true})
    .select('-password')
    .then(updatedUser => {
      res.status(200).json(updatedUser);
    })
    .catch(err => {
      res.status(500).json({message: "Failed to update profile", error: err});
    });
});



//delete profile
router.delete('/',auth,(req,res)=>{
  const userId = req.user.userId;
  User.findByIdAndDelete(userId)
    .then(deletedUser => {
      if (!deletedUser) {
        return res.status(404).json({message: "User not found"});
      }
      res.status(200).json({message: "Profile deleted successfully"});
    })
    .catch(err => {
      res.status(500).json({message: "Failed to delete profile", error: err});
    });
});


module.exports = {UserRouter: router};
