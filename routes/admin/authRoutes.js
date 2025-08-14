const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  changePassword,
} = require("../../controller/admin/authController");
const { verifyAdmin } = require("../../middlewares/admin/adminAuth");

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.put("/change-password/:id", verifyAdmin, changePassword);

module.exports = router;
