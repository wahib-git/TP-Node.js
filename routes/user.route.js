const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send({ message: "User created successfully", user });
  } catch (error) {
    res.status(400).send({ message: "Error saving user" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    throw new Error(error.message);
  }
});
router.get("/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).send({ message: "user not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      res.status(404).send({ message: "user not found" });
    }
    const newUser = await User.findOneAndUpdate(
      { email: req.params.email },
      { $set: { email: req?.body?.email ?? "example@test.com" } },
      { new: true }
    );
    res.send(newUser);
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

router.delete("/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      res.status(404).send({ message: "user not found" });
    }
    await User.deleteOne({ email: req.params.email });

    res.send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

module.exports = router;
