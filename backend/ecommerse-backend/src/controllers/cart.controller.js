const cartService = require("../services/cart.service");

// GET CART
const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user._id);

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// ADD TO CART
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await cartService.addToCart(
      req.user._id,
      productId,
      quantity === undefined ? 1 : quantity
    );

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE CART ITEM
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    const cart = await cartService.updateCartItem(
      req.user._id,
      req.params.productId,
      quantity
    );

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// REMOVE FROM CART
const removeFromCart = async (req, res, next) => {
  try {
    const cart = await cartService.removeFromCart(
      req.user._id,
      req.params.productId
    );

    return res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};