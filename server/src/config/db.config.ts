import mongoose from "mongoose";
import { AppConfig } from "./app.config";

export async function connectDB() {
  try {
    await mongoose.connect(AppConfig.databaseUri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("DB connection error:", err);
    process.exit(1);
  }
}
