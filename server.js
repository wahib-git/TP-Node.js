const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./routes/user.route");
require("dotenv").config();
const AuthRoute = require("./routes/auth.routes");

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI) //connect to the database
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });

// Define a simple route
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.use("/users", userRoute);
app.use("/auth", AuthRoute);

port = process.env.PORT || 7000;
// Start the server
app.listen(port, () => {
  console.log("Server is listening on " + port);
});
