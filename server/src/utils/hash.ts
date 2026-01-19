
import bcrypt from "bcrypt";
import crypto from "crypto";

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export function comparePassword(password: string, hashed: string) {
  return bcrypt.compare(password, hashed);
}

export function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

export function hashOTP(otp: string) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export function compareOTP(otp: string, otpHash: string) {
  const hashed = hashOTP(otp);
  return crypto.timingSafeEqual(
    Buffer.from(hashed),
    Buffer.from(otpHash)
  );
}
