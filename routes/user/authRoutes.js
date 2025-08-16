const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updateUser,
  changePassword,
  deleteUser,
  getUsers,
  getUsersById,
} = require("../../controller/user/authController");
const { verifyUser } = require("../../middlewares/user/userAuth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/get", getUsers);
router.get("/get/:id", getUsersById);

router.post("/forgot", verifyUser, forgotPassword);
router.put("/reset-password", verifyUser, resetPassword);
router.put("/update/:id", verifyUser, updateUser);
router.put("/change-password/:id", verifyUser, changePassword);
router.delete("/delete/:id", verifyUser, deleteUser);

module.exports = router;
