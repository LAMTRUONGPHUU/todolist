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

