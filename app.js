const userAuthRoutes = require("./routes/user/authRoutes");
const adminAuthRoutes = require("./routes/admin/authRoutes");
const productManagementRoutes = require("./routes/product/productManagementRoutes");
const categoryManagementRoutes = require("./routes/category/categoryManagementRoutes");
const reviewsRoutes = require("./routes/reviews/reviewsRoutes");
const promoManagementRoutes = require("./routes/promo/promoRoutes");
const userPromoRoutes = require("./routes/user/promoRoutes")
const productRoutes = require("./routes/product/prouctRoutes");

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
app.use("/api/admin/products", productManagementRoutes);
app.use("/api/admin/categories", categoryManagementRoutes);
app.use("/api/user/reviews", reviewsRoutes);
app.use("/api/admin/promo", promoManagementRoutes);
app.use("/api/user/promo", userPromoRoutes);
app.use("/api/products", productRoutes);    

module.exports = app;