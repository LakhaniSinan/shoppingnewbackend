require("dotenv").config();
const app = require("./app");
const mongoose = require("mongoose");
const PORT = 8001;
const MONGO_URI ="mongodb://localhost:27017/shoppingToday";

mongoose.connect("mongodb://localhost:27017/shoppingToday")
  .then(() => {
    console.log(`MongoDB connected live ${MONGO_URI}`);
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });