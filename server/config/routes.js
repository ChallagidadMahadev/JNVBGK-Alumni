import authRoutes from "../routes/auth.js";
import eventRoutes from "../routes/events.js";
import newsRoutes from "../routes/news.js";
import alumniRoutes from "../routes/alumni.js";
import batchRoutes from "../routes/batches.js";

export const configureRoutes = (app) => {
  app.use("/auth", authRoutes);
  app.use("/events", eventRoutes);
  app.use("/news", newsRoutes);
  app.use("/alumni", alumniRoutes);
  app.use("/batches", batchRoutes);

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  });
};
