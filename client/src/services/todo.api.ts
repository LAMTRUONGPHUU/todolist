import axiosClient from "@/libs/axios";


export enum TodoStatus {
  NOT_STARTED = 0,
  IN_PROGRESS = 1,
  COMPLETED = 2
}
export type Todo = {
  _id: string;
  title: string;
  content: string;
  status: TodoStatus;
  userId: string;
};

export const STATUS_LABEL: Record<TodoStatus, string> = {
  [TodoStatus.NOT_STARTED]: "Not Started",
  [TodoStatus.IN_PROGRESS]: "In Progress",
  [TodoStatus.COMPLETED]: "Completed",
};

type CreateTodoInput = {
  title: string;
  content?: string;
};

export const fetchTodos = async () => {
  const { data } = await axiosClient.get<Todo[]>("/todo");
  return data;
};

export const createTodo = async ({ title, content }: CreateTodoInput) => {
  const { data } = await axiosClient.post("/todo", { title, content });
  return data;
};

export const toggleTodo = async (id: string, completed: boolean) => {
  const { data } = await axiosClient.patch(`/todo/${id}`, { completed });
  return data;
};

export const deleteTodo = async (id: string) => {
  return axiosClient.delete(`/todo/${id}`);
};

export const updateTodoStatus = async (
  id: string,
  status: TodoStatus
): Promise<Todo> => {
  const { data } = await axiosClient.patch(`/todo/${id}`, { status });
  return data;
};

export const updateTodo = async (id: string, title: string, content: string): Promise<Todo> => {
  const { data } = await axiosClient.patch(`/todo/${id}`, { title, content });
  return data;
}
