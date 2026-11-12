const express = require("express");

const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

// PUBLIC ROUTES

// GET ALL PRODUCTS
router.get("/", getAllProducts);

// GET SINGLE PRODUCT
router.get("/:id", getProductById);

// ADMIN PROTECTED ROUTES

// CREATE PRODUCT
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createProduct
);

// UPDATE PRODUCT
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateProduct
);

// DELETE PRODUCT
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct
);

module.exports = router;