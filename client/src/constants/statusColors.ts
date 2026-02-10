import { TodoStatus } from "@/types/todo";

export type StatusColorConfig = {
  bg: string;
  border: string;
  text: string;
  hover: string;
  columnBg: string;
};

export const DEFAULT_STATUS_COLORS: Record<TodoStatus, StatusColorConfig> = {
  [TodoStatus.NOT_STARTED]: {
    bg: "bg-gray-100",
    border: "border-gray-300",
    text: "text-gray-700",
    hover: "hover:bg-gray-200",
    columnBg: "bg-gray-50",
  },
  [TodoStatus.IN_PROGRESS]: {
    bg: "bg-blue-100",
    border: "border-blue-300",
    text: "text-blue-700",
    hover: "hover:bg-blue-200",
    columnBg: "bg-blue-50",
  },
  [TodoStatus.COMPLETED]: {
    bg: "bg-green-100",
    border: "border-green-300",
    text: "text-green-700",
    hover: "hover:bg-green-200",
    columnBg: "bg-green-50",
  },
};

export const COLOR_OPTIONS = [
  { name: "Gray", value: "gray" },
  { name: "Blue", value: "blue" },
  { name: "Green", value: "green" },
  { name: "Red", value: "red" },
  { name: "Yellow", value: "yellow" },
  { name: "Purple", value: "purple" },
  { name: "Pink", value: "pink" },
  { name: "Indigo", value: "indigo" },
  { name: "Orange", value: "orange" },
  { name: "Teal", value: "teal" },
];

export const getColorConfig = (color: string): StatusColorConfig => {
  return {
    bg: `bg-${color}-100`,
    border: `border-${color}-300`,
    text: `text-${color}-700`,
    hover: `hover:bg-${color}-200`,
    columnBg: `bg-${color}-50`,
  };
};
