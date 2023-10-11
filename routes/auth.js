const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const {
  validateName,
  validateEmail,
  validatePassword,
} = require("../utils/validators");
const File = require("../models/filesModel");
const isAuthenticated = require("../middlewares/authJwt");

router.post("/signup", async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(403).json({ err: "User already exists" });
    }

    if (!validateName(username)) {
      return res.status(400).json({
        err: "Invalid user username: username must be longer than two characters and must not include any numbers or special characters",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ err: "Error: Invalid email" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        err: "Error: Invalid password: password must be at least 8 characters long and must include atleast one - one uppercase letter, one lowercase letter, one digit, one special character",
      });
    }

    const hashedPassword = await bcrypt.hash(password, (saltOrRounds = 10));
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    const createdUser = await user.save();

    return res.status(200).json({
      message: `Account Created Successfully Thank you for signing up`,
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email.length === 0) {
      return res.status(400).json({ err: "Please enter your email" });
    }
    if (password.length === 0) {
      return res.status(400).json({ err: "Please enter your password" });
    }

    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(403).json("Error: User not found");
    }

    const passwordMatched = await bcrypt.compare(
      password,
      existingUser.password
    );
    console.log(passwordMatched + "+++>");
    if (!passwordMatched) {
      return res.status(400).send({
        message: "Email or Password is Incorrect!",
      });
    }

    const payload = { user: { id: existingUser._id } };
    console.log(payload);
    const accessToken = jwt.sign(payload, process.env.secret, {
      expiresIn: 360000,
    });

    res.cookie("token", accessToken, { expire: new Date() + 360000 });

    console.log("Logged in successfully");

    return res.status(200).json({
      success: true,
      message: "Login successfully",
      user: {
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
      },
      accessToken,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: err.message });
  }
});

router.get("/signout", async (_req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ err: err.message });
  }
});
//user details
router.get("/userfiles", isAuthenticated, async (req, res) => {
  try {
    console.log("qqw", req.user);
    const files = await File.find({ createdBy: req.user._id });

    if (!files) {
      return res.status(404).json({ message: "No File not found" });
    }
    // console.log(files);
    const shortUrls = files.map(({ _id, shortUrl }) => ({ _id, shortUrl }));
    // successfully deleted
    return res.status(200).json({ message: "File Found", links: shortUrls });
  } catch (error) {
    res.status(500).json({ message: `Server Error + ${error.message}` });
  }
});

module.exports = router;
