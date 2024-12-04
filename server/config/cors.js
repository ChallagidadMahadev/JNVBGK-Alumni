import cors from "cors";

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://frolicking-moonbeam-d09148.netlify.app"]
      : ["http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

export const configureCors = () => cors(corsOptions);
