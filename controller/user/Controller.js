const Promo = require("../../model/promo/promoModel");
const User = require("../../model/user/userModel");
const { successHelper, errorHelper } = require("../../utilities/helpers");

const applyPromo = async (req, res) => {
  try {
    const { promoName } = req.body;

    if (!promoName)
      return errorHelper(res, null, "Promo code is required", 400);

    // Find the promo by name (case-insensitive)
    const promo = await Promo.findOne({ name: promoName.toUpperCase() });
    if (!promo) return errorHelper(res, null, "Promo code not found", 404);

    const now = new Date();
    if (now < promo.startDate || now > promo.endDate || !promo.isActive) {
      return errorHelper(res, null, "Promo expired or inactive", 400);
    }

    // Apply the promo to the user
    await User.findByIdAndUpdate(
      req.user._id,
      { promoCode: promo._id },
      { new: true }
    );

    return successHelper(res, promo, "Promo code applied successfully");
  } catch (error) {
    return errorHelper(res, error, "Failed to apply promo", 500);
  }
};

module.exports = { applyPromo };
