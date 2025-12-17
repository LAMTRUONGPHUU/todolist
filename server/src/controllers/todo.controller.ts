
import { type Request, type Response } from "express";
import { todoService } from "../services/todo.service";
import { BadRequestError } from "@/utils/error/badRequest";

export async function create(req: Request, res: Response) {
  if (!req.user || !req.user.id) {
    throw new BadRequestError("Unauthorized");
  }
  const userId = req.user.id
  const { title, content } = req.body;
  const todo = await todoService.createTodo(userId, title, content);
  res.json(todo);
}

export async function list(req: Request, res: Response) {
  if (!req.user || !req.user.id) {
    throw new BadRequestError("Unauthorized");
  }
  const userId = req.user.id
  const todos = await todoService.getTodos(userId);
  res.json(todos);
}

export async function update(req: Request, res: Response) {
  const { params, body } = req;
  const { title, content, status } = body;
  if (!req.user || !req.user.id) {
    throw new BadRequestError("Unauthorized");
  }
  const userId = req.user.id
  if (!params.id)
    return res.status(400).json({ message: "Invalid request" });
  const todo = await todoService.updateTodo(params.id, userId, title, content, status);
  res.json(todo);
}

export async function remove(req: Request, res: Response) {
  const { params } = req
  if (!req.user || !req.user.id) {
    throw new BadRequestError("Unauthorized");
  }
  const userId = req.user.id
  if (!params.id)
    return res.status(400).json({ message: "Invalid request" });
  await todoService.deleteTodo(params.id, userId);
  res.json({ message: "Deleted" });
}

export async function removeMany(req: Request, res: Response) {
  const { body } = req;
  const { ids } = body;
  if (!req.user || !req.user.id) {
    throw new BadRequestError("Unauthorized");
  }
  const userId = req.user.id
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "Invalid request" });
  }
  await todoService.deleteManyTodos(ids, userId);
  res.json({ message: "Deleted" });
}

export const todoController = {
  create,
  list,
  update,
  remove,
  removeMany,
}
