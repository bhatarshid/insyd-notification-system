const express = require("express");
const bodyParser = require("body-parser");
const notificationRoutes = require("./routes/notification-route");

const app = express();

app.use(bodyParser.json());

app.use("/notifications", notificationRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
