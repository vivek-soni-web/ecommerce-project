const admin = (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    // Allow admin access
    next();

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Admin authorization failed",
    });
  }
};

module.exports = admin;