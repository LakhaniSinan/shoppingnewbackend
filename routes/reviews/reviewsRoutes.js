const express = require("express");
const router = express.Router();
const {
  createReview,
  getReviewsForProduct,
  updateReview,
  deleteReview,
} = require("../../controller/reviews/reviewsController");
const {verifyUser}  = require("../../middlewares/user/userAuth");

router.post("/create", verifyUser, createReview);
router.get("/get/:productId", verifyUser, getReviewsForProduct);
router.put("/update/:reviewId", verifyUser, updateReview);
router.delete("/delete/:reviewId", verifyUser, deleteReview);

module.exports = router;
