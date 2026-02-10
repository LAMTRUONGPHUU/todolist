import { useDroppable } from "@dnd-kit/core";
import { TodoCard } from "./TodoCard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Todo, TodoStatus } from "@/types/todo";
import { useStatusColors } from "@/contexts/ColorContext";

type Props = {
  status: TodoStatus;
  title: string;
  todos: Todo[];
  over: any;
};

export const TodoColumn = ({ status, title, todos, over }: Props) => {
  const { statusColors } = useStatusColors();
  const colors = statusColors[status];

  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      status: status,
      type: "column",
    },
  });

  const isOverColumn = isOver || (over?.data?.current?.status === status);

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[400px] flex-1 flex-col rounded-xl border p-4 transition ${isOverColumn ? colors.columnBg : "bg-gray-50"
        } ${colors.border}`}
    >
      <h3 className={`mb-4 text-lg font-bold ${colors.text}`}>{title}</h3>

      <SortableContext
        items={todos.map((t) => t._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3">
          {todos.map((todo) => (
            <TodoCard key={todo._id} todo={todo} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};
