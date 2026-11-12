const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

// CREATE ORDER
const createOrder = async (userId, shippingAddress, paymentMethod = "COD") => {
  const cart = await Cart.findOne({ user: userId })
    .populate("items.product");

  if (!cart || cart.items.length === 0) {
    const error = new Error("Your cart is empty");
    error.statusCode = 400;
    throw error;
  }

  if (
    !shippingAddress ||
    !shippingAddress.fullName ||
    !shippingAddress.phone ||
    !shippingAddress.address ||
    !shippingAddress.city ||
    !shippingAddress.state ||
    !shippingAddress.postalCode ||
    !shippingAddress.country
  ) {
    const error = new Error("Complete shipping address is required");
    error.statusCode = 400;
    throw error;
  }

  if (!["COD", "ONLINE"].includes(paymentMethod)) {
    const error = new Error("Invalid payment method");
    error.statusCode = 400;
    throw error;
  }

  let itemsPrice = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = item.product;

    if (!product || !product.isActive) {
      const error = new Error("A product in your cart is unavailable");
      error.statusCode = 400;
      throw error;
    }

    if (product.stock < item.quantity) {
      const error = new Error(
        `Insufficient stock for ${product.name}`
      );
      error.statusCode = 400;
      throw error;
    }

    itemsPrice += product.price * item.quantity;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0]?.url || "",
      quantity: item.quantity,
      price: product.price,
    });
  }

  // Calculate prices
  const shippingPrice = itemsPrice >= 1000 ? 0 : 50;
  const taxPrice = Number((itemsPrice * 0.05).toFixed(2));
  const totalPrice = Number(
    (itemsPrice + shippingPrice + taxPrice).toFixed(2)
  );

  // Create order
  const order = await Order.create({
    user: userId,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  // Reduce product stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { stock: -item.quantity },
    });
  }

  // Clear cart
  cart.items = [];
  await cart.save();

  return order;
};

// GET LOGGED-IN USER ORDERS
const getMyOrders = async (userId) => {
  return await Order.find({ user: userId })
    .sort({ createdAt: -1 });
};

// GET SINGLE ORDER
const getOrderById = async (orderId, userId) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  return order;
};

// CANCEL ORDER
const cancelOrder = async (orderId, userId) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (
    ["Shipped", "Delivered", "Cancelled"].includes(order.orderStatus)
  ) {
    const error = new Error("This order cannot be cancelled");
    error.statusCode = 400;
    throw error;
  }

  // Restore product stock
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  order.orderStatus = "Cancelled";
  await order.save();

  return order;
};

// ADMIN: GET ALL ORDERS
const getAllOrders = async () => {
  return await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
};

// ADMIN: UPDATE ORDER STATUS
const updateOrderStatus = async (orderId, orderStatus) => {
  const allowedStatuses = [
    "Processing",
    "Confirmed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  if (!allowedStatuses.includes(orderStatus)) {
    const error = new Error("Invalid order status");
    error.statusCode = 400;
    throw error;
  }

  const order = await Order.findById(orderId);

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (order.orderStatus === "Cancelled") {
    const error = new Error("Cancelled order cannot be updated");
    error.statusCode = 400;
    throw error;
  }

  if (order.orderStatus === "Delivered" && orderStatus !== "Delivered") {
    const error = new Error("Delivered order cannot be changed");
    error.statusCode = 400;
    throw error;
  }

  if (orderStatus === "Delivered") {
    order.deliveredAt = new Date();
  }

  // Restore stock if admin cancels order
  if (orderStatus === "Cancelled") {
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }
  }

  order.orderStatus = orderStatus;
  await order.save();

  return order;
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};