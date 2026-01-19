import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;   // optional
  avatar: string;
  provider?: "local" | "google";
  isVerified?: boolean;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,     // ✅ not required
    select: false,
  },
  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },
  avatar: {
    type: String,
    default: "",
  },
  isVerified: {
    type: Boolean,
    default: false,
  }

}, { timestamps: true })

export const User = mongoose.model<IUser>("User", userSchema);
