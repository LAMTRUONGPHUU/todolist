
import { Todo } from "../models/todo.model";
import { TodoStatus } from "../enums/todoStatus";
import mongoose from "mongoose";
import { BadRequestError } from "@/utils/error/badRequest";

export function createTodo(userId: string, title: string, content: string) {
  return Todo.create({
    title: title.trim(),
    content: content ? content.trim() : "",
    status: TodoStatus.NOT_STARTED,
    userId
  });
}

export function getTodos(userId: string) {
  return Todo.find({ userId }).sort({ createdAt: -1 });
}

export async function updateTodo(id: string, userId: string, title?: string, content?: string, status?: TodoStatus) {
  await getValidatedTodo(id, userId);
  // Create an object containing only the fields provided (PATCH logic)
  const updateFields: any = {};
  if (title !== undefined) updateFields.title = title;
  if (content !== undefined) updateFields.content = content;
  if (status !== undefined) updateFields.status = status;

  const updatedTodo = await Todo.findByIdAndUpdate(
    id,
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  return updatedTodo;
}

export async function deleteTodo(id: string, userId: string) {
  await getValidatedTodo(id, userId);
  return Todo.findByIdAndDelete(id);
}

export async function deleteManyTodos(ids: string[], userId: string) {
  for (const id of ids) {
    await getValidatedTodo(id, userId);
  }
  return Todo.deleteMany({ _id: { $in: ids } });
}

async function getValidatedTodo(id: string, userId: string) {
  const todo = await Todo.findById(id);

  if (!todo) {
    throw new BadRequestError("Todo not found");
  }

  if (!todo.userId) {
    throw new BadRequestError("Todo has no associated user");
  }

  if (todo.userId.toString() !== userId) {
    throw new BadRequestError("Unauthorized to access this todo");
  }

  return todo;
}
export const todoService = {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  deleteManyTodos
};
