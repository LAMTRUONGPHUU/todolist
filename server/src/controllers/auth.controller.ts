import { authService } from "@/services/auth.service";
import { setRefreshTokenCookie } from "@/utils/cookie";
import { type Request, type Response } from "express";
import { verifyRefreshToken, signAccessToken } from "../utils/jwt";

export async function register(req: Request, res: Response) {
  const { email, password, confirmPassword } = req.body;

  try {
    const user = await authService.registerUser(email, password, confirmPassword);
    res.json(user)
    console.log("User registered:", user.email);
  }
  catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const { user, accessToken, refreshToken } = await authService.loginUser(email, password);

    setRefreshTokenCookie(res, refreshToken);

    res.json({
      message: "Login successful",
      accessToken,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) throw new Error("No refresh token");

    const payload = verifyRefreshToken(token) as any;

    const newAccessToken = signAccessToken({ id: payload.id, email: payload.email });

    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(401).json({ message: "Invalid refresh token" });
  }
}

export function logout(req: Request, res: Response) {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
}


export const authController = {
  register, login
}
