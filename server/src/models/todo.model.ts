import mongoose from "mongoose";
import { TodoStatus } from "@/enums/todoStatus";

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  status: { type: Number, enum: [0, 1, 2], default: TodoStatus.NOT_STARTED },
  userId: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "User" }
});

export const Todo = mongoose.model("Todo", todoSchema);
