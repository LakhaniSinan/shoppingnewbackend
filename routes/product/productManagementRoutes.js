const express = require("express");
const router = express.Router();
const { createProduct, updateProduct } = require("../../controller/product/productManagementController");
const { verifyAdmin } = require("../../middlewares/admin/adminAuth");

router.post("/create", verifyAdmin, createProduct);
router.put("/update/:id", verifyAdmin, updateProduct);

module.exports = router;
