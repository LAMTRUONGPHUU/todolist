
import { AppConfig } from "@/config/app.config";
import session from "express-session";

export const sessionMiddleware = session({
  secret: AppConfig.sessionSecret,
  resave: false,
  saveUninitialized: false,
})
