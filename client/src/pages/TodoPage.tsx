import { useEffect, useState } from "react";
import { closestCenter, defaultDropAnimationSideEffects, DndContext, DragOverlay, useDndContext, type DragEndEvent, type DragOverEvent, type DragStartEvent, type UniqueIdentifier } from "@dnd-kit/core";
import { useTodos } from "@/hooks/useTodos";
import { TodoColumn } from "@/components/TodoColumn";
import { STATUS_COLUMNS, STATUS_LABEL } from "@/constants/todo";
import { TrashDropZone } from "@/components/TrashDropZone";
import { EditDropZone } from "@/components/EditDropZone";
import { EditTodoDialog } from "@/components/EditTodoDialog";
import { Container } from "lucide-react";
import type { Todo, TodoStatus } from "@/types/todo";

const TodoPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isDragging, setIsDragging] = useState(false);


  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { updateTodo } = useTodos();

  const { over } = useDndContext();
  const {
    todos: serverTodos,
    createTodo,
    deleteTodo,
    updateTodoStatus,
  } = useTodos();


  const [localTodos, setLocalTodos] = useState<Todo[]>([]);

  useEffect(() => {
    setLocalTodos(serverTodos ?? []);
  }, [serverTodos]);

  const handleAdd = () => {
    if (!title.trim()) return;

    createTodo({
      title,
      content,
    });

    setTitle("");
    setContent("");
  };

  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);

  function findContainerId(itemId: UniqueIdentifier): UniqueIdentifier | undefined {
    if (STATUS_COLUMNS.some((container) => container === itemId)) {
      return itemId;
    }
    return STATUS_COLUMNS.find((container) =>
      localTodos.some((item) => item.status === container && item._id === itemId)
    );
  }

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);

    const id = event.active.id as string;
    const todo = localTodos.find((t) => t._id === id);

    setActiveTodo(todo ?? null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id;

    const activeContainerId = findContainerId(activeId);
    const overContainerId = findContainerId(overId);

    // Fix: Check for undefined explicitly, not falsy check
    if (activeContainerId === undefined || overContainerId === undefined) return;
    if (activeContainerId === overContainerId) return;

    setLocalTodos((prev) =>
      prev.map((todo) =>
        todo._id === activeId
          ? { ...todo, status: overContainerId as TodoStatus }
          : todo
      )
    );
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTodo(null);
    setIsDragging(false);

    if (!over) {
      return;
    }

    const activeId = active.id as string;

    // 🗑 DROPPED ON TRASH
    if (over.id === "TRASH") {
      const confirmed = window.confirm("Do you want to delete this task?");
      if (confirmed) {
        deleteTodo(activeId);
      }
      return;
    }

    // ✏️ DROPPED ON EDIT
    if (over.id === "EDIT") {
      const todo = serverTodos?.find((t) => t._id === activeId);
      if (todo) {
        setEditingTodo(todo);
        setIsEditOpen(true);
      }
      return;
    }

    // 👉 NORMAL COLUMN DROP
    const overContainerId = findContainerId(over.id);

    if (overContainerId === undefined) {
      return;
    }

    const draggedTodo = serverTodos?.find((t) => t._id === activeId);
    if (!draggedTodo) return;

    const finalStatus = overContainerId as TodoStatus;

    // Only update if status changed
    if (draggedTodo.status !== finalStatus) {
      updateTodoStatus({
        id: activeId,
        status: finalStatus,
      });
    }
  };
  const handleDragCancel = () => {
    setIsDragging(false);
    setActiveTodo(null);
    setLocalTodos(serverTodos ?? []);
  };
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };
  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-bold">📝 Todo Board</h1>

      {/* Create Todo */}
      <div className="mb-6 flex flex-col gap-2 rounded-lg border bg-white p-4 shadow-sm">
        <input
          className="rounded border px-3 py-2 focus:outline-none focus:ring"
          placeholder="Todo title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="rounded border px-3 py-2 focus:outline-none focus:ring"
          placeholder="Todo content..."
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={handleAdd}
          className="self-start rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Todo
        </button>
      </div>

      {/* Board */}
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        onDragOver={handleDragOver}
        collisionDetection={closestCenter}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {STATUS_COLUMNS.map((status) => (
            <TodoColumn
              key={status}
              status={status}
              title={STATUS_LABEL[status]}
              todos={localTodos.filter((t) => t.status === status)}
              over={over}
            />
          ))}
        </div>
        <DragOverlay dropAnimation={dropAnimation}>
          {isDragging && activeTodo ? (
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg cursor-grabbing transform rotate-2 ">
              <strong className="block text-gray-900 font-semibold mb-1">
                {activeTodo.title}
              </strong>
              {activeTodo.content && (
                <p className="text-sm text-gray-500 line-clamp-2">
                  {activeTodo.content}
                </p>
              )}
            </div>
          ) : null}
        </DragOverlay>
        <EditDropZone isDragging={isDragging} />
        <TrashDropZone isDragging={isDragging} />
      </DndContext>
      <EditTodoDialog
        open={isEditOpen}
        todo={editingTodo}
        onClose={() => setIsEditOpen(false)}
        onSave={(data) => {
          if (!editingTodo) return;

          updateTodo({
            id: editingTodo._id,
            title: data.title,
            content: data.content || "",


          });
        }}
      />
    </div>
  );
};

export default TodoPage;
