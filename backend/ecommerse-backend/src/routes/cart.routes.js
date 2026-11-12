const express = require("express");

const router = express.Router();

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} = require("../controllers/cart.controller");

const authMiddleware = require("../middlewares/auth.middleware");

// ALL CART ROUTES REQUIRE LOGIN

// GET USER CART
router.get("/", authMiddleware, getCart);

// ADD PRODUCT TO CART
router.post("/", authMiddleware, addToCart);

// UPDATE PRODUCT QUANTITY
router.put("/:productId", authMiddleware, updateCartItem);

// REMOVE PRODUCT FROM CART
router.delete("/:productId", authMiddleware, removeFromCart);

module.exports = router;