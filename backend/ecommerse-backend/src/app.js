const express = require("express");
const cors = require("cors");

const app = express();

// IMPORT ROUTES
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");

// IMPORT ERROR MIDDLEWARE
const errorMiddleware = require("./middlewares/error.middleware");

// BASIC MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// HEALTH CHECK API
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "E-Commerce Backend API is running successfully",
  });
});

// API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// 404 MIDDLEWARE
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// CENTRALIZED ERROR MIDDLEWARE
app.use(errorMiddleware);

module.exports = app;