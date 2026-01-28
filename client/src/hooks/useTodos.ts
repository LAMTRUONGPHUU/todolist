
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchTodos,
  createTodo,
  toggleTodo,
  deleteTodo,
  type Todo,
  TodoStatus,
  updateTodoStatus,
  updateTodo,
} from "../services/todo.api";

export const useTodos = () => {
  const queryClient = useQueryClient();

  // GET todos
  const todosQuery = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // CREATE todo
  const createTodoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: (newTodo) => {
      queryClient.setQueryData(["todos"], (oldTodos: Todo[] | undefined) => {
        if (!oldTodos) return [newTodo];
        return [newTodo, ...oldTodos];
      });
    },
  });

  // TOGGLE todo
  const toggleTodoMutation = useMutation({
    mutationFn: ({
      id,
      completed,
    }: {
      id: string;
      completed: boolean;
    }) => toggleTodo(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const updateTodoStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: TodoStatus;
    }) => updateTodoStatus(id, status),

    // Optimistic update (🔥 recommended)
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);

      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old?.map((todo) =>
          todo.id === id ? { ...todo, status } : todo
        )
      );

      return { previousTodos };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
    },

  });

  const updateTodoMutation = useMutation({
    mutationFn: ({
      id,
      title,
      content,
    }: {
      id: string;
      title: string;
      content: string;
    }) => updateTodo(id, title, content),

    onSuccess: (updatedTodo) => {
      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old
          ? old.map((t) =>
            t.id === updatedTodo.id ? updatedTodo : t
          )
          : []
      );
    },
  });

  // DELETE todo
  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: (_data, deletedId) => {
      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old ? old.filter((t) => t.id !== deletedId) : []
      );
    },
  });

  return {
    // query
    todos: todosQuery.data ?? [],
    isLoading: todosQuery.isLoading,
    isError: todosQuery.isError,

    // mutations
    createTodo: createTodoMutation.mutate,
    isCreating: createTodoMutation.isPending,

    toggleTodo: toggleTodoMutation.mutate,
    isToggling: toggleTodoMutation.isPending,

    updateTodoStatus: updateTodoStatusMutation.mutate,
    isUpdatingStatus: updateTodoStatusMutation.isPending,

    updateTodo: updateTodoMutation.mutate,

    deleteTodo: deleteTodoMutation.mutate,
    isDeleting: deleteTodoMutation.isPending,
  };
};
