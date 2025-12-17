import { Router } from "express";
import { authRouter } from "./auth.route";
import { todoRouter } from "./todo.route";
import { auth } from "@/middlewares/auth.middleware";

export const apiRouter = Router();


apiRouter.use("/auth", authRouter);
apiRouter.use("/todo", auth, todoRouter);
