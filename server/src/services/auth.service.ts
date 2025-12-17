import { User } from "@/models/user.model";
import { comparePassword, hashPassword } from "@/utils/hash";
import { signAccessToken, signRefreshToken } from "@/utils/jwt";

export async function registerUser(email: string, password: string, confirmPassword: string) {
  const exists = await User.findOne({ email });
  if (exists) throw new Error("Email already exists")
  if (password !== confirmPassword) throw new Error("Passwords do not match")
  const hashed = await hashPassword(password);
  return User.create({ email, password: hashed });
}

export async function loginUser(email: string, password: string) {

  const user = await User.findOne({ email }).select("+password");
  if (!user || !user.password) {
    throw new Error("Invalid email or password");
  }

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

export const authService = {
  registerUser,
  loginUser
}
