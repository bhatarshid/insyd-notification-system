const express = require("express");
const bodyParser = require("body-parser");
const notificationRoutes = require("./routes/notification-route");
const userRoutes = require("./routes/user-route");
const postRoutes = require("./routes/post-route");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/notifications", notificationRoutes);
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes)

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
