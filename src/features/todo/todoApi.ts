import { iTodo } from "./todoSlice";

// A mock function to mimic making an async request for data
export function addTodoAsync(todo: iTodo) {
  return new Promise<{ data: iTodo }>((resolve) =>
    setTimeout(() => resolve({ data: todo }), 1500)
  );
}
