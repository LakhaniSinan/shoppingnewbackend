const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
//   forgotPassword,
//   resetPassword,
  updateUser,
  changePassword,
  deleteUser,
  getUsers,
  getUsersById,
} = require("../../controller/user/authController");
const { verifyUser } = require("../../middlewares/user/userAuth");

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.post("/forgot", forgotPassword);
// router.put("/reset/:token", resetPassword);
router.get("/get", getUsers);
router.get("/get/:id", getUsersById);
router.put("/update/:id", verifyUser, updateUser);
router.put("/change-password/:id", verifyUser, changePassword);
router.delete("/delete/:id", verifyUser, deleteUser);

module.exports = router;
