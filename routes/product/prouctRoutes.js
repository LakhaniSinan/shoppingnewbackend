const express = require("express");
const router = express.Router();
const {
  getProductById,
  getProducts,
} = require("../../controller/product/productManagementController");
const { verifyUser } = require("../../middlewares/user/userAuth");

router.get("/get",verifyUser, getProducts);
router.get("/get/:id",verifyUser, getProductById);

module.exports = router;
