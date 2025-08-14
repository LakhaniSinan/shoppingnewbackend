const userAuthRoutes = require("./routes/user/authRoutes");
const adminAuthRoutes = require("./routes/admin/authRoutes");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
//   next();
// });
app.use("/api/admin", adminAuthRoutes);
app.use("/api/user", userAuthRoutes);

module.exports = app;