import { User } from "@/models/user.model";
import { Verification } from "@/models/verification.model";
import { compareOTP, comparePassword, generateOTP, hashOTP, hashPassword } from "@/utils/hash";
import { signAccessToken, signRefreshToken } from "@/utils/jwt";
import { sendOTPEmail } from "@/utils/mailer";


const OTP_EXPIRE_MIN = 10;
const RESEND_COOLDOWN_SEC = 60;
const MAX_RESEND = 5;

import crypto from "crypto";

type RegisterDto = {
  email: string,
  password: string,
  confirmPassword: string,
}

export async function registerUser({
  email,
  password,
  confirmPassword,
}: RegisterDto) {
  /* ---------- 1. Validate ---------- */
  const exists = await User.findOne({ email });
  if (exists) {
    throw new Error("Email already exists");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  /* ---------- 2. Create user (unverified) ---------- */
  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    email,
    password: hashedPassword,
    isVerified: false,
  });

  /* ---------- 3. Clear old OTP sessions ---------- */
  await Verification.deleteMany({
    email,
    type: "EMAIL_VERIFY",
  });

  /* ---------- 4. Create OTP session ---------- */
  const otp = generateOTP();
  const sessionId = crypto.randomUUID();

  await Verification.create({
    sessionId,
    userId: user._id,
    email,
    type: "EMAIL_VERIFY",
    otpHash: hashOTP(otp),
    attempts: 0,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  /* ---------- 5. Send email ---------- */
  await sendOTPEmail(email, otp);

  /* ---------- 6. Return safe data ---------- */
  return {
    message: "OTP sent to email. Please verify your account.",
    sessionId,     // ⭐ FE lưu localStorage
    expiresIn: 300 // optional UX
  };
}

export async function loginUser(email: string, password: string) {

  const user = await User.findOne({ email }).select("+password");
  if (!user || !user.password) {
    throw new Error("Invalid email or password");
  }

  if (!user.isVerified)
    throw new Error("Please verify your email first");

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const payload = { id: user._id, email: user.email };

  return {
    user,
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}

export async function findUserById(userId: string) {
  const user = await User.findById(userId).select("_id email avatar");
  return user;
}


export async function verifyEmail(email: string, otp: string) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  if (user.isVerified)
    return { message: "Email already verified" };

  const record = await Verification.findOne({
    userId: user._id,
    type: "EMAIL_VERIFY",
  });

  if (!record) throw new Error("Verification not found");

  if (record.expiresAt < new Date())
    throw new Error("OTP expired");

  if (record.otpHash !== hashOTP(otp)) {
    record.attempts += 1;
    await record.save();
    throw new Error("Invalid OTP");
  }

  user.isVerified = true;
  await user.save();
  await Verification.deleteOne({ _id: record._id });


  const payload = { id: user!._id, email: user!.email };

  return {
    user,
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
}


export async function verifyEmailOtp({
  sessionId,
  otp,
}: {
  sessionId: string;
  otp: string;
}) {
  const verification = await Verification.findOne({
    sessionId,
    type: "EMAIL_VERIFY",
  });

  if (!verification) {
    throw new Error("Invalid or expired OTP session");
  }

  if (verification.expiresAt < new Date()) {
    await verification.deleteOne();
    throw new Error("OTP expired");
  }

  if (verification.attempts >= 5) {
    await verification.deleteOne();
    throw new Error("Too many failed attempts");
  }

  const isValid = compareOTP(otp, verification.otpHash);

  if (!isValid) {
    verification.attempts += 1;
    await verification.save();
    throw new Error("Invalid OTP");
  }

  /* ---------- Verify user ---------- */
  await User.findByIdAndUpdate(verification.userId, {
    isVerified: true,
  });

  await verification.deleteOne();

  /* ---------- Issue token ---------- */
  const user = await User.findById(verification.userId);
  const payload = { id: user!._id, email: user!.email };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
    user,
  };
}

export async function resendVerifyEmailOtp(sessionId: string) {
  const verification = await Verification.findOne({
    sessionId,
    type: "EMAIL_VERIFY",
  });

  if (!verification) {
    throw new Error("OTP session not found");
  }

  if (verification.expiresAt > new Date(Date.now() - 60 * 1000)) {
    throw new Error("Please wait before requesting a new OTP");
  }

  const otp = generateOTP();

  verification.otpHash = hashOTP(otp);
  verification.expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  verification.attempts = 0;

  await verification.save();
  await sendOTPEmail(verification.email, otp);

  return { message: "OTP resent" };
}
export const authService = {
  registerUser,
  loginUser,
  findUserById,
  verifyEmail,
  verifyEmailOtp,
  resendVerifyEmailOtp
}
