const express = require("express");
const helmet = require("helmet");
const responseTime = require("response-time");
require("dotenv").config();

process.env.TZ = "Europe/Paris";

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");

const app = express();
app.disable("X-Powered-By");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(helmet());
app.use(express.json());
app.use(responseTime());

app.use("/api/v1", authRoutes);
app.use("/api/v1/users", usersRoutes);

module.exports = { app };
