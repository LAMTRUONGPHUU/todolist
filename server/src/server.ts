import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";

import { connectDB } from "./config/db.config.ts";
import { errorHandler } from "./middlewares/error.middleware.ts";
import { sessionMiddleware } from "./middlewares/session.middleware.ts";
import { apiRouter } from "./routes/api.route.ts";
import { AppConfig } from "./config/app.config.ts";

dotenv.config();

async function bootstrap() {
  try {
    await connectDB(); // ⭐ CHỜ DB

    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(sessionMiddleware);

    app.use(
      cors({
        origin: "http://localhost:5173",
        credentials: true,
      })
    );

    app.use("/api", apiRouter);
    app.use(errorHandler);

    app.listen(AppConfig.serverPort, () => {
      console.log(`🚀 Server running on port ${AppConfig.serverPort}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server", err);
    process.exit(1);
  }
}

bootstrap();
