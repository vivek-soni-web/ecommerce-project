const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

// GET USER CART
const getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId })
    .populate("items.product", "name price images stock");

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  return cart;
};

// ADD PRODUCT TO CART
const addToCart = async (userId, productId, quantity = 1) => {
  if (!Number.isInteger(quantity) || quantity < 1) {
    const error = new Error("Quantity must be a positive integer");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findOne({
    _id: productId,
    isActive: true,
  });

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (product.stock < quantity) {
    const error = new Error("Insufficient product stock");
    error.statusCode = 400;
    throw error;
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > product.stock) {
      const error = new Error("Requested quantity exceeds available stock");
      error.statusCode = 400;
      throw error;
    }

    existingItem.quantity = newQuantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
    });
  }

  await cart.save();

  return await Cart.findById(cart._id)
    .populate("items.product", "name price images stock");
};

// UPDATE CART ITEM QUANTITY
const updateCartItem = async (userId, productId, quantity) => {
  if (!Number.isInteger(quantity) || quantity < 1) {
    const error = new Error("Quantity must be a positive integer");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findOne({
    _id: productId,
    isActive: true,
  });

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (quantity > product.stock) {
    const error = new Error("Insufficient product stock");
    error.statusCode = 400;
    throw error;
  }

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    const error = new Error("Cart not found");
    error.statusCode = 404;
    throw error;
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (!item) {
    const error = new Error("Product not found in cart");
    error.statusCode = 404;
    throw error;
  }

  item.quantity = quantity;

  await cart.save();

  return await Cart.findById(cart._id)
    .populate("items.product", "name price images stock");
};

// REMOVE PRODUCT FROM CART
const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    const error = new Error("Cart not found");
    error.statusCode = 404;
    throw error;
  }

  const initialLength = cart.items.length;

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  if (cart.items.length === initialLength) {
    const error = new Error("Product not found in cart");
    error.statusCode = 404;
    throw error;
  }

  await cart.save();

  return await Cart.findById(cart._id)
    .populate("items.product", "name price images stock");
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};