import { TodoStatus } from '../enums/todo-status.enum';

export interface Todo {
  _id: string;
  title: string;
  content?: string;
  status: TodoStatus;
  userId: string;
}

