const Promo = require("../../model/promo/promoModel");
const { successHelper, errorHelper } = require("../../utilities/helpers");

const createPromo = async (req, res) => {
  try {
    const { name, discount, startDate, endDate } = req.body;

    if (!name || !discount || !startDate || !endDate)
      return errorHelper(res, null, "All fields are required", 400);

    const existing = await Promo.findOne({ name: name.toUpperCase() });
    if (existing) return errorHelper(res, null, "Promo already exists", 400);

    const promo = await Promo.create({
      name: name.toUpperCase(),
      discount,
      startDate,
      endDate,
    });

    return successHelper(res, promo, "Promo created successfully", 201);
  } catch (error) {
    return errorHelper(res, error, "Failed to create promo", 500);
  }
};

// Get all Promos
const getPromos = async (req, res) => {
  try {
    const promos = await Promo.find();
    if (!promos.length) return errorHelper(res, null, "No promos found", 404);

    return successHelper(res, promos, "Promos fetched successfully");
  } catch (error) {
    return errorHelper(res, error, "Failed to fetch promos", 500);
  }
};

// Get Promo by ID
const getPromoById = async (req, res) => {
  try {
    const { id } = req.params;
    const promo = await Promo.findById(id);
    if (!promo) return errorHelper(res, null, "Promo not found", 404);

    return successHelper(res, promo, "Promo fetched successfully");
  } catch (error) {
    return errorHelper(res, error, "Failed to fetch promo", 500);
  }
};

// Update Promo
const updatePromo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.name) updates.name = updates.name.toUpperCase();

    const updatedPromo = await Promo.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedPromo) return errorHelper(res, null, "Promo not found", 404);

    return successHelper(res, updatedPromo, "Promo updated successfully");
  } catch (error) {
    return errorHelper(res, error, "Failed to update promo", 500);
  }
};

// Delete Promo
const deletePromo = async (req, res) => {
  try {
    const { id } = req.params;
    const promo = await Promo.findByIdAndDelete(id);
    if (!promo) return errorHelper(res, null, "Promo not found", 404);

    return successHelper(res, null, "Promo deleted successfully");
  } catch (error) {
    return errorHelper(res, error, "Failed to delete promo", 500);
  }
};

const togglePromo = async (req, res) => {
  try {
    const { id } = req.params;
    const promo = await Promo.findById(id);
    if (!promo) return errorHelper(res, null, "Promo not found", 404);

    promo.isActive = !promo.isActive;
    await promo.save();

    return successHelper(
      res,
      promo,
      `Promo is now ${promo.isActive ? "active" : "inactive"}`
    );
  } catch (error) {
    return errorHelper(res, error, "Failed to toggle promo", 500);
  }
};

module.exports = {
  createPromo,
  getPromos,
  getPromoById,
  updatePromo,
  deletePromo,
  togglePromo,
};
