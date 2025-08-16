const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    discountedPrice: { type: Number },
    description: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: { type: Number, default: 1 },
    discount: { type: Number, default: 0 },
    image: { type: String, required: true },
  ratings: { type: Number, default: 0 }, // average rating
  numOfReviews: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.discount && this.price) {
    this.discountedPrice = this.price - (this.price * this.discount) / 100;
  } else {
    this.discountedPrice = this.price;
  }
  next();
});

productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.discount !== undefined || update.price !== undefined) {
    const price =
      update.price !== undefined ? update.price : this._update.price;
    const discount =
      update.discount !== undefined
        ? update.discount
        : this._update.discount || 0;
    update.discountedPrice = price - (price * discount) / 100;
    this.setUpdate(update);
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
