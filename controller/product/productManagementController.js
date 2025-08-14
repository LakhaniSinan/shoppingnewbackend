const Product = require("../../model/product/productModel");
const Category = require("../../model/category/categoryModel");
const { successHelper, errorHelper } = require("../../utilities/helpers");

const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, quantity, discount, image } =
      req.body;

    if (!name || !price || !description || !category || !quantity || !image) {
      return errorHelper(
        res,
        null,
        "All required fields must be provided",
        400
      );
    }

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
      return errorHelper(
        res,
        null,
        "Product with this name already exists",
        400
      );
    }

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return errorHelper(res, null, "Invalid category ID", 400);
    }

    const newProduct = new Product({
      name,
      price,
      description,
      category,
      quantity,
      discount: discount || 0,
      image,
      ratings: 0,
      reviews: [],
    });

    await newProduct.save();
    return successHelper(res, newProduct, "Product created successfully", 201);
  } catch (error) {
    return errorHelper(res, error, "Failed to create product", 500);
  }
};
  
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category, quantity, discount, image } =
      req.body;

    if (!name || !price || !description || !category || !quantity || !image) {
      return errorHelper(
        res,
        null,
        "All required fields must be provided",
        400
      );
    }

    // 1️⃣ Check if category ID is valid
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return errorHelper(res, null, "Invalid category ID", 400);
    }

    // 2️⃣ Check if product name is already used by another product
    const existingProduct = await Product.findOne({ name, _id: { $ne: id } });
    if (existingProduct) {
      return errorHelper(
        res,
        null,
        "Product with this name already exists",
        400
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price,
        description,
        category,
        quantity,
        discount: discount || 0,
        image,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return errorHelper(res, null, "Product not found", 404);
    }

    return successHelper(
      res,
      updatedProduct,
      "Product updated successfully",
      200
    );
  } catch (error) {
    return errorHelper(res, error, "Failed to update product", 500);
  }
};

module.exports = {
  createProduct,
  updateProduct,
};
