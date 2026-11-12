const Product = require("../models/product.model");

// ADD PRODUCT
const createProduct = async (productData, userId) => {
  const product = await Product.create({
    ...productData,
    createdBy: userId,
  });

  return product;
};

// GET ALL PRODUCTS
const getAllProducts = async (query = {}) => {
  const filter = { isActive: true };

  if (query.category) {
    filter.category = query.category;
  }

  if (query.search) {
    filter.name = {
      $regex: query.search,
      $options: "i",
    };
  }

  const products = await Product.find(filter)
    .sort({ createdAt: -1 });

  return products;
};

// GET SINGLE PRODUCT
const getProductById = async (productId) => {
  const product = await Product.findOne({
    _id: productId,
    isActive: true,
  });

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

// UPDATE PRODUCT
const updateProduct = async (productId, updateData) => {
  const allowedFields = [
    "name",
    "description",
    "price",
    "category",
    "brand",
    "images",
    "stock",
    "ratings",
    "numReviews",
    "isActive",
  ];

  const safeData = {};

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      safeData[field] = updateData[field];
    }
  });

  const product = await Product.findByIdAndUpdate(
    productId,
    safeData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

// DELETE PRODUCT
const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndDelete(productId);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    message: "Product deleted successfully",
  };
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};