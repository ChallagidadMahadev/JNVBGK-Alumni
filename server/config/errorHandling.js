export const configureErrorHandling = (app, errorHandler) => {
  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err) => {
    console.error("Unhandled Promise Rejection:", err);
    // Log error but don't exit process
    console.error(err);
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    if (err.code === "EADDRINUSE") {
      console.log("Port is already in use, trying another port...");
      return;
    }
    // For other errors, exit the process
    if (app.listening) {
      app.close(() => process.exit(1));
    } else {
      process.exit(1);
    }
  });

  // Add error handler middleware
  app.use(errorHandler);
};
