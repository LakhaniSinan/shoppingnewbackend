const express = require("express");
const router = express.Router();
const { createProduct } = require("../../controller/product/productManagementController");
const { verifyAdmin } = require("../../middlewares/admin/adminAuth");

router.post("/create", verifyAdmin, createProduct);

module.exports = router;
