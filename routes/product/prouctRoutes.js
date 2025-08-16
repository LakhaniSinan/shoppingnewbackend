const express = require("express");
const router = express.Router();
const {
  getProductById,
  getProducts,
} = require("../../controller/product/productManagementController");
const verifyOptionalAuth = require("../../middlewares/verifyOptionalAuth");

router.get("/get", verifyOptionalAuth, getProducts);
router.get("/get/:id",verifyOptionalAuth, getProductById);

module.exports = router;
