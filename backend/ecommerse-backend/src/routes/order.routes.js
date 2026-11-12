const express = require("express");

const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/order.controller");

const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

// ALL ORDER ROUTES REQUIRE LOGIN
router.use(authMiddleware);

// CUSTOMER ROUTES

// CREATE ORDER
router.post("/", createOrder);

// GET MY ORDERS
router.get("/my-orders", getMyOrders);

// GET SINGLE ORDER
router.get("/:id", getOrderById);

// CANCEL ORDER
router.patch("/:id/cancel", cancelOrder);

// ADMIN ROUTES

// GET ALL ORDERS
router.get(
  "/admin/all",
  adminMiddleware,
  getAllOrders
);

// UPDATE ORDER STATUS
router.patch(
  "/admin/:id/status",
  adminMiddleware,
  updateOrderStatus
);

module.exports = router;