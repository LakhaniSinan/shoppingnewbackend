const mongoose = require("mongoose");
const Review = require("../../model/reviews/reviewsModel");
const Product = require("../../model/product/productModel");
const { successHelper, errorHelper } = require("../../utilities/helpers");

const createReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;
    if (!req.user || !req.user._id) {
      return errorHelper(res, null, "Unauthorized", 401);
    }
    const user = req.user._id;

    if (!product || !rating) {
      return errorHelper(res, null, "Product and rating are required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(product)) {
      return errorHelper(res, null, "Invalid product ID", 400);
    }
    const existingProduct = await Product.findById(product);
    if (!existingProduct) {
      return errorHelper(res, null, "Invalid product ID", 400);
    }

    const existingReview = await Review.findOne({ product, user });
    if (existingReview) {
      return errorHelper(res, null, "You have already reviewed this product", 400);
    }

    const newReview = new Review({ product, user, rating, comment });
    await newReview.save();

    return successHelper(res, newReview, "Review created successfully", 201);
  } catch (error) {
    return errorHelper(res, error, "Failed to create review", 500);
  }
};

const getReviewsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return errorHelper(res, null, "Invalid product ID", 400);
    }

    const reviews = await Review.find({ product: productId })
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    if (!reviews || reviews.length === 0) {
      return errorHelper(res, null, "No reviews found for this product", 404);
    }

    return successHelper(res, reviews, "Reviews fetched successfully", 200);
  } catch (error) {
    return errorHelper(res, error, "Failed to fetch reviews", 500);
  }
};

const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const user = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return errorHelper(res, null, "Invalid review ID", 400);
    }

    const review = await Review.findOne({ _id: reviewId, user });
    if (!review) {
      return errorHelper(res, null, "Review not found or unauthorized", 404);
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    return successHelper(res, review, "Review updated successfully", 200);
  } catch (error) {
    return errorHelper(res, error, "Failed to update review", 500);
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const user = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return errorHelper(res, null, "Invalid review ID", 400);
    }

    const review = await Review.findOneAndDelete({ _id: reviewId, user });
    if (!review) {
      return errorHelper(res, null, "Review not found or unauthorized", 404);
    }

    return successHelper(res, null, "Review deleted successfully", 200);
  } catch (error) {
    return errorHelper(res, error, "Failed to delete review", 500);
  }
};

module.exports = {
  createReview,
  getReviewsForProduct,
  updateReview,
  deleteReview,
};
