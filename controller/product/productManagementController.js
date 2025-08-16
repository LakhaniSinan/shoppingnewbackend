const mongoose = require("mongoose");
const Product = require("../../model/product/productModel");
const Category = require("../../model/category/categoryModel");
const Review = require("../../model/reviews/reviewsModel");
const { successHelper, errorHelper } = require("../../utilities/helpers");

const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, quantity, discount, image } =
      req.body;

    // Required fields check
    if (!name || !price || !description || !category || !quantity || !image) {
      return errorHelper(
        res,
        null,
        "All required fields must be provided",
        400
      );
    }

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return errorHelper(res, null, "Invalid category ID", 400);
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorHelper(res, null, "Invalid product ID", 400);
    }
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

    // 1️⃣ Check if product ID is valid
    const existingproduct = await Product.findById(id);
    if (!existingproduct) {
      return errorHelper(res, null, "Invalid product ID", 400);
    }

    // Validate category ID
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

const getProducts = async (req, res) => {
  try {
    console.log("Fetching all products...");
    const products = await Product.find().populate("category", "name").lean();
    console.log("Products fetched:", products.length);

    if (!products || products.length === 0) {
      console.log("No products found.");
      return errorHelper(res, null, "No products found", 404);
    }

    const productIds = products.map((p) => p._id);
    console.log("Product IDs:", productIds);

    const reviews = await Review.find({ product: { $in: productIds } })
      .populate("user", "fullName email")
      .select("rating comment user createdAt product")
      .sort({ createdAt: -1 });
    console.log("Reviews fetched:", reviews.length);

    let productsWithReviews = products.map((product) => {
      const productReviews = reviews.filter(
        (r) => r.product.toString() === product._id.toString()
      );
      console.log(`Product ${product.name} has ${productReviews.length} reviews`);
      return { ...product, reviews: productReviews };
    });

    // ===============================
    // Role-based Promo Code Logic
    // ===============================
    if (req.user && req.user.role === "user") {
      console.log("Logged-in user found:", req.user._id);

      if (req.user.promoCode) {
        console.log("User has a promo code, populating...");
        await req.user.populate("promoCode");
        const promo = req.user.promoCode;
        console.log("Promo populated:", promo);

        const now = new Date();
        if (promo && promo.isActive && promo.startDate <= now && promo.endDate >= now) {
          const discountPercent = promo.discount;
          console.log("Applying promo discount:", discountPercent);

          productsWithReviews = productsWithReviews.map((product) => {
            const basePrice = product.discountedPrice || product.price; 
            const finalPrice = basePrice - (basePrice * discountPercent) / 100;
            console.log(`Product ${product.name} original: ${product.price}, after product discount: ${basePrice}, after promo: ${finalPrice}`);
            return { ...product, discountedPrice: finalPrice };
          });
        } else {
          console.log("Promo is inactive or expired.");
        }
      } else {
        console.log("User has no promo code.");
      }
    } else if (req.user && req.user.role === "admin") {
      console.log("Admin logged in, skipping promo code logic.");
    } else {
      console.log("No logged-in user detected.");
    }

    return successHelper(res, productsWithReviews, "Products retrieved successfully", 200);
  } catch (error) {
    console.error("Error in getProducts:", error);
    return errorHelper(res, error, "Failed to retrieve products", 500);
  }
};


const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching product by ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid product ID");
      return errorHelper(res, null, "Invalid product ID", 400);
    }

    let product = await Product.findById(id)
      .populate("category", "name")
      .populate({
        path: "reviews",
        select: "rating comment user createdAt",
        populate: { path: "user", select: "fullName email" },
      })
      .lean();
    console.log("Product fetched:", product ? product.name : null);

    if (!product) {
      console.log("Product not found.");
      return errorHelper(res, null, "Product not found", 404);
    }

    // Promo code logic
    if (req.user) {
      console.log("Logged-in user found:", req.user._id);
      if (req.user.promoCode) {
        console.log("User has a promo code, populating...");
        await req.user.populate("promoCode");
        const promo = req.user.promoCode;
        console.log("Promo populated:", promo);

        const now = new Date();
        if (promo && promo.isActive && promo.startDate <= now && promo.endDate >= now) {
          const discountPercent = promo.discount;
          const basePrice = product.discountedPrice || product.price;
          product.discountedPrice = basePrice - (basePrice * discountPercent) / 100;
          console.log(`Product ${product.name} original: ${product.price}, after product discount: ${basePrice}, after promo: ${product.discountedPrice}`);
        } else {
          console.log("Promo is inactive or expired.");
        }
      } else {
        console.log("User has no promo code.");
      }
    } else {
      console.log("No logged-in user detected.");
    }

    return successHelper(res, product, "Product fetched successfully", 200);
  } catch (error) {
    console.error("Error in getProductById:", error);
    return errorHelper(res, error, "Failed to fetch product", 500);
  }
};


const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorHelper(res, null, "Invalid product ID", 400);
    }
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return errorHelper(res, null, "Product not found", 404);
    }
    return successHelper(res, null, "Product deleted successfully", 200);
  } catch (error) {
    return errorHelper(res, error, "Failed to delete Product", 500);
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getProducts,
  getProductById,
  deleteProduct,
};
