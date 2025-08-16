const express = require("express");
const router = express.Router();
const {
  createPromo,
  deletePromo,
  getPromoById,
  getPromos,
  togglePromo,
  updatePromo,
} = require("../../controller/promo/promoController");
const { verifyAdmin } = require("../../middlewares/admin/adminAuth");

router.post("/create", verifyAdmin, createPromo);
router.delete("/delete/:id", verifyAdmin, deletePromo);
router.get("/get/:id", verifyAdmin, getPromoById);
router.get("/get", verifyAdmin, getPromos);
router.put("/toggle-promo/:id", verifyAdmin, togglePromo);
router.put("/update/:id", verifyAdmin, updatePromo);

module.exports = router