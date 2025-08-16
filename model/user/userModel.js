const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    promoCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Promo",
      default: null,
    },
    resetPasswordOtp: { type: String },
    resetPasswordExpire: { type: Date }, 
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
