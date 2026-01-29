import { useEffect, useState } from "react";
import { closestCenter, defaultDropAnimationSideEffects, DndContext, DragOverlay, useDndContext, type DragEndEvent, type DragOverEvent, type DragStartEvent, type UniqueIdentifier } from "@dnd-kit/core";
import { useTodos } from "@/hooks/useTodos";
import { TodoColumn } from "@/components/TodoColumn";
import { STATUS_COLUMNS, STATUS_LABEL } from "@/constants/todo";
import { TodoStatus, type Todo } from "@/services/todo.api";
import { TrashDropZone } from "@/components/TrashDropZone";
import { EditDropZone } from "@/components/EditDropZone";
import { EditTodoDialog } from "@/components/EditTodoDialog";
import { Container } from "lucide-react";

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
    if (!isDragging) {
      setLocalTodos(serverTodos ?? []);
    }
  }, [serverTodos, isDragging]);

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
    if (localTodos.some((localTodo) => localTodo._id === itemId)) return itemId


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
    let newStatus = over.id as TodoStatus;

    // 🧠 if we are hovering a CARD, use its column’s status
    if (over.data?.current?.status !== undefined) {
      newStatus = over.data.current.status as TodoStatus;
    }

    setLocalTodos((todos) =>
      todos.map((todo) =>
        todo._id === activeId && todo.status !== newStatus
          ? { ...todo, status: newStatus }
          : todo
      )
    );
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setIsDragging(false);
    setActiveTodo(null);

    if (!over) {
      setLocalTodos(serverTodos ?? []);
      return;
    }

    const activeId = active.id as string;

    // 🗑 DROPPED ON TRASH
    if (over.id === "TRASH") {
      const confirmed = window.confirm(
        "Do you want to delete this task?"
      );

      if (confirmed) {
        deleteTodo(activeId);
      } else {
        setLocalTodos(serverTodos ?? []);
      }
      return;
    }

    if (over.id === "EDIT") {
      const todo = serverTodos?.find((t) => t._id === activeId);
      if (!todo) return;

      setEditingTodo(todo);
      setIsEditOpen(true);

      // snap back
      setLocalTodos(serverTodos ?? []);
      return;
    }
    // 👉 NORMAL COLUMN DROP
    const draggedTodo = serverTodos?.find((t) => t._id === activeId);
    if (!draggedTodo) return;

    const finalStatus =
      over.data?.current?.status ?? (over.id as TodoStatus);

    if (draggedTodo.status === finalStatus) return;

    updateTodoStatus({
      id: activeId,
      status: finalStatus,
    });
  };
  const handleDragCancel = () => {
    setIsDragging(false);
    setActiveTodo(null);
    setLocalTodos(serverTodos ?? []);
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
        <DragOverlay
          dropAnimation={null}
        >
          {isDragging && activeTodo ? (
            <div className="rounded-lg border bg-white p-3 shadow-lg">
              <strong>{activeTodo.title}</strong>
              <p className="text-sm text-gray-600">{activeTodo.content}</p>
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
