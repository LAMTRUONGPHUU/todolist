import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import { connectDB } from './config/db.config.ts';
import cookieParser from "cookie-parser";
import { errorHandler } from './middlewares/error.middleware.ts';
import { AppConfig } from './config/app.config.ts';
import console from 'node:console';
import { sessionMiddleware } from './middlewares/session.middleware.ts';
import { apiRouter } from './routes/api.route.ts';
import passport from 'passport';
import './config/passport.config.ts';
dotenv.config();

const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use(sessionMiddleware);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connectDB();

app.use("/api", apiRouter);

app.use(errorHandler);

app.listen(AppConfig.serverPort, () => {
  console.log('Server is running on port 3000');
})
