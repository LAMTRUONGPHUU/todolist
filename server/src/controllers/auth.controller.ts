import { authService } from "@/services/auth.service";
import { setRefreshTokenCookie } from "@/utils/cookie";
import { type Request, type Response } from "express";
import { verifyRefreshToken, signAccessToken } from "../utils/jwt";

export async function register(req: Request, res: Response) {
  const { email, password, confirmPassword, avatar } = req.body;

  try {
    const user = await authService.registerUser({
      email, password, confirmPassword
    });
    res.json(user)
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
        avatar: user.avatar,
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

export async function me(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const payload = verifyRefreshToken(refreshToken) as {
      id: string;
      email: string;
    };

    const user = await authService.findUserById(payload.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const accessToken = signAccessToken({
      id: user._id,
      email: user.email,
    });

    res.json({
      user: {
        id: user._id,
        email: user.email,
        avatar: user.avatar,
      },
      accessToken,
    });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

export async function verifyEmail(req: Request, res: Response) {
  const { sessionId, otp } = req.body;

  if (!sessionId || !otp) {
    return res.status(400).json({
      message: "Missing sessionId or otp",
    });
  }

  try {
    const result = await authService.verifyEmailOtp({
      sessionId,
      otp,
    });

    res.json(result);
  } catch (err: any) {
    res.status(400).json({
      message: err.message,
    });
  }
}

export async function resendVerifyEmail(req: Request, res: Response) {
  try {
    const { sessionId } = req.body;
    const result = await authService.resendVerifyEmailOtp(sessionId);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
}
export const authController = {
  resendVerifyEmail, register, login, me, refreshToken, logout, verifyEmail
}
