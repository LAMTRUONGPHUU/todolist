import { Schema, model, Types } from "mongoose";

export type VerificationType =
  | "EMAIL_VERIFY"
  | "RESET_PASSWORD"
  | "CHANGE_EMAIL";

const verificationSchema = new Schema(
  {
    /* ---------- OTP SESSION ---------- */
    sessionId: {
      type: String,
      required: true,
      index: true,
      unique: true, // ⭐ session là khóa chính
    },

    /* ---------- TARGET ---------- */
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["EMAIL_VERIFY", "RESET_PASSWORD", "CHANGE_EMAIL"],
      required: true,
      index: true,
    },

    /* ---------- SECURITY ---------- */
    otpHash: {
      type: String,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Verification = model(
  "Verification",
  verificationSchema
);
