const express = require("express");
const router = express.Router();
const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../../controller/product/productManagementController");
const { verifyAdmin } = require("../../middlewares/admin/adminAuth");

router.post("/create", verifyAdmin, createProduct);
router.put("/update/:id", verifyAdmin, updateProduct);
router.delete("/delete/:id", verifyAdmin, deleteProduct);

module.exports = router;
