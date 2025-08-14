const Category = require("../../model/category/categoryModel");
const { successHelper, errorHelper } = require("../../utilities/helpers");

const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name || !description) {
      return errorHelper(res, null, "Name and description are required", 400);
    }

    const newCategory = new Category({
      name,
      description,
      image: image || null, // Optional field
    });

    await newCategory.save();
    return successHelper(
      res,
      newCategory,
      "Category created successfully",
      201
    );
  } catch (error) {
    return errorHelper(res, error, "Failed to create category", 500);
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return errorHelper(res, null, "Category not found", 404);
    }

    category.name = name || category.name;
    category.description = description || category.description;
    category.image = image || category.image;

    await category.save();
    return successHelper(res, category, "Category updated successfully", 200);
  } catch (error) {
    return errorHelper(res, error, "Failed to update category", 500);
  }
};

const getCategory = async (req, res) => {
  try {
    const category = await Category.find();
    if (!category) {
      return errorHelper(res, null, "Category not found", 404);
    }
    return successHelper(res, category, "Category retrieved successfully", 200);
  } catch (error) {
    return errorHelper(res, error, "Failed to retrieve category", 500);
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return errorHelper(res, null, "Category not found", 404);
    }
    return successHelper(res, category, "Category retrieved successfully", 200);
  } catch (error) {
    return errorHelper(res, error, "Failed to retrieve category", 500);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return errorHelper(res, null, "Category not found", 404);
    }
    return successHelper(res, null, "Category deleted successfully", 200);
  } catch (error) {
    return errorHelper(res, error, "Failed to delete category", 500);
  }
};

module.exports = {
  createCategory,
  updateCategory,
  getCategory,
  getCategoryById,
  deleteCategory,
};
