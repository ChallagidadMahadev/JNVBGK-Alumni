export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle mongoose validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation Error",
      errors: Object.values(err.errors).map((error) => error.message),
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    return res.status(400).json({
      message: "Duplicate entry found",
      field: Object.keys(err.keyPattern)[0],
    });
  }

  // Default error
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
};

// Async handler wrapper
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
