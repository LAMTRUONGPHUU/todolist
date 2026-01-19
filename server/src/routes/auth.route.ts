import { authController } from '@/controllers/auth.controller';
import { validate } from '@/middlewares/validate.middleware';
import { setRefreshTokenCookie } from '@/utils/cookie';
import { signAccessToken, signRefreshToken } from '@/utils/jwt';
import { authValidator } from '@/validators/auth.validator';
import Router from 'express';
import passport from 'passport';

export const authRouter = Router();

authRouter.post("/register", authValidator.register, validate, authController.register);
authRouter.post("/login", authValidator.login, validate, authController.login);
authRouter.get("/me", validate, authController.me);
authRouter.post("/refresh", authController.refreshToken);
authRouter.post("/logout", authController.logout);
authRouter.post("/verify", authController.verifyEmail);
authRouter.post("/resend", authController.resendVerifyEmail)
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
authRouter.get("/google/callback", passport.authenticate("google", { session: false }),
  async (req: any, res) => {
    const user = req.user;

    const payload = { id: user._id, email: user.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    setRefreshTokenCookie(res, refreshToken);
    const redirectUrl =
      `${process.env.CLIENT_URL}/oauth/callback?accessToken=${accessToken}`;
    res.redirect(redirectUrl);

  }
);
