// app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./routers/api.js";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import { DATABASE, PORT, WEB_CASH, rateLimitConfig } from "./services/config/config.js";

const app = express();
app.set("etag", WEB_CASH);
app.use(express.urlencoded({ extended: true }));

// ====== Middleware ======
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// ====== Rate Limiter ======
const limiter = rateLimit(rateLimitConfig);
app.use(limiter);

// ====== Simple GET Route ======
app.get("/hello", (req, res) => {
  res.send("Hello StitchOS");
});

// ====== Use Main Router ======
app.use("/stitchos", router);

// ====== MongoDB Connection ======
mongoose
  .connect(DATABASE, { autoIndex: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(() => console.log("❌ MongoDB Connection Failed"));

// ====== Start Server ======
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
