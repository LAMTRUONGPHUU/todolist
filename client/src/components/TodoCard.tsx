
// components/TodoCard.tsx
import type { Todo } from "@/services/todo.api";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  todo: Todo;
};

export const TodoCard = ({ todo }: Props) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({
    id: todo.id,
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
      className="cursor-grab rounded-lg border bg-white p-3 shadow-sm hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold">{todo.title}</h4>
          {todo.content && (
            <p className="mt-1 text-sm text-gray-600">{todo.content}</p>
          )}
        </div>

      </div>
    </div>
  );
};
