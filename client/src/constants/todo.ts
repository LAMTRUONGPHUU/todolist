import { TodoStatus } from "@/types/todo";


export const STATUS_COLUMNS: TodoStatus[] = [
  TodoStatus.NOT_STARTED,
  TodoStatus.IN_PROGRESS,
  TodoStatus.COMPLETED,
];

export const STATUS_LABEL: Record<TodoStatus, string> = {
  [TodoStatus.NOT_STARTED]: "Not Started",
  [TodoStatus.IN_PROGRESS]: "In Progress",
  [TodoStatus.COMPLETED]: "Completed",
};
