import type { Todo } from "@/types/todo";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useStatusColors } from "@/contexts/ColorContext";

type Props = {
  todo: Todo;
};

export const TodoCard = ({ todo }: Props) => {
  const { statusColors } = useStatusColors();
  const colors = statusColors[todo.status];

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({
    id: todo._id,
    data: {
      status: todo.status,
      type: "card",
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`cursor-grab rounded-lg border ${colors.border} ${colors.bg} p-3 shadow-sm ${colors.hover}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className={`font-semibold ${colors.text}`}>{todo.title}</h4>
          {todo.content && (
            <p className="mt-1 text-sm text-gray-600">{todo.content}</p>
          )}
        </div>
      </div>
    </div>
  );
};
