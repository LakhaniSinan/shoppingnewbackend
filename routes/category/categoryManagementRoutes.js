const express = require("express");
const router = express.Router();
const {
  createCategory,
  updateCategory,
  getCategory,
  getCategoryById,
  deleteCategory,
} = require("../../controller/category/categoryManagementController");
const { verifyAdmin } = require("../../middlewares/admin/adminAuth");

router.post("/create", verifyAdmin, createCategory);
router.put("/update/:id", verifyAdmin, updateCategory);
router.get("/get", verifyAdmin, getCategory);
router.get("/get/:id", verifyAdmin, getCategoryById);
router.delete("/delete/:id", verifyAdmin, deleteCategory);

module.exports = router;
