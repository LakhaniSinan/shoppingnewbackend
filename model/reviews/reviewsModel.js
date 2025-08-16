const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

// Prevent duplicate reviews by the same user for the same product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to calculate average rating and number of reviews
reviewSchema.statics.calculateRatings = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        numOfReviews: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      ratings: stats[0].avgRating,
      numOfReviews: stats[0].numOfReviews,
    });
  } else {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      ratings: 0,
      numOfReviews: 0,
    });
  }
};

// Hooks to update product ratings automatically
reviewSchema.post("save", async function () {
  // Add this review id to the product's reviews array (avoid duplicates)
  await mongoose.model("Product").findByIdAndUpdate(this.product, {
    $addToSet: { reviews: this._id },
  });
  // Recalculate ratings
  await this.constructor.calculateRatings(this.product);
});

reviewSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) await doc.constructor.calculateRatings(doc.product);
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    // Remove this review id from the product's reviews array
    await mongoose.model("Product").findByIdAndUpdate(doc.product, {
      $pull: { reviews: doc._id },
    });
    // Recalculate ratings
    await doc.constructor.calculateRatings(doc.product);
  }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
