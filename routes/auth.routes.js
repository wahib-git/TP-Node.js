const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user");
const authentification = require("../middlewares/authMiddleware");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).send({ message: "User saved successfully", user });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).send({ message: "User not found" });
    }
    const isHavePassword = await user.comparePassword(password);
    if (!isHavePassword) {
      res.status(400).send({ message: "Invalid credentials" });
    }
    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
    res.send({ message: "user logged in successful", token });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

router.get("/me", authentification, async (req, res) => {
  try {
    console.log("running...");
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
