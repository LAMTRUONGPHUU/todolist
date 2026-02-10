import { createContext, useContext, useState, type ReactNode } from "react";
import type { TodoStatus } from "@/types/todo";
import { DEFAULT_STATUS_COLORS, getColorConfig, type StatusColorConfig } from "@/constants/statusColors";

type StatusColors = Record<TodoStatus, StatusColorConfig>;

type ColorContextType = {
  statusColors: StatusColors;
  updateStatusColor: (status: TodoStatus, color: string) => void;
  resetColors: () => void;
};

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export const ColorProvider = ({ children }: { children: ReactNode }) => {
  const [statusColors, setStatusColors] = useState<StatusColors>(DEFAULT_STATUS_COLORS);

  const updateStatusColor = (status: TodoStatus, color: string) => {
    setStatusColors((prev) => ({
      ...prev,
      [status]: getColorConfig(color),
    }));
  };

  const resetColors = () => {
    setStatusColors(DEFAULT_STATUS_COLORS);
  };

  return (
    <ColorContext.Provider value={{ statusColors, updateStatusColor, resetColors }}>
      {children}
    </ColorContext.Provider>
  );
};

export const useStatusColors = () => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error("useStatusColors must be used within ColorProvider");
  }
  return context;
};
