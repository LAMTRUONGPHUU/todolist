
import { Router } from "express";
import { todoController } from "../controllers/todo.controller";
import { todoValidator } from "@/validators/todo.validator";
import { validate } from "@/middlewares/validate.middleware";

export const todoRouter = Router();

todoRouter.post("/", todoValidator.create, validate, todoController.create);
todoRouter.get("/", todoController.list);
todoRouter.patch("/:id", todoValidator.update, validate, todoController.update);
todoRouter.delete("/:id", todoValidator.delete, validate, todoController.remove);
todoRouter.delete("/", todoValidator.deleteMany, validate, todoController.removeMany);
