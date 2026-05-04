import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import lectureRoutes from "./routes/lectureRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import { connectDB } from "./config/db.js";
import { globalRateLimiter } from "./middleware/rateLimitter.js";
import reviewRoute from "./routes/reviewRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import currencyRoutes from "./routes/currencyRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import { handleStripeWebhook } from "./controllers/paymentController.js";
connectDB();

const app = express();

app.set("trust proxy", 1);

const PORT = process.env.PORT || 5000;

app.post(
  "payment/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

app.use(
  cors({
    origin: "https://learnify-frontend-six.vercel.app/",
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(globalRateLimiter);

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/course", courseRoutes);
app.use("/lecture", lectureRoutes);
app.use("/cart", cartRoutes);
app.use("/review", reviewRoute);
app.use("/payment", paymentRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/currency", currencyRoutes);
app.use("/contact", contactRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
