import { iTodo } from "./todoSlice";
import { MutationFunction } from "./useMutation";

let requests = 0;
let failedRequests = 0;

// A mock function to mimic making an async request for data
export function makeCrudRequest(todo: iTodo) {
  requests++
  return new Promise<MutationFunction<iTodo>>((resolve, reject) =>
    setTimeout(() => {
      const failureRatio = failedRequests / requests;
      if (failureRatio < 0.2) {
        failedRequests++;
        return reject("We were not able to process your request.Mock server randomly rejects 20% of the time");
      }
      resolve({ data: todo } as any) //TODO: fix typing issues - I've well and trully fucked us up
    }, 800)
  );
}

export const addTodoAsync = makeCrudRequest;
export const editTodoAsync = makeCrudRequest;
export const deleteTodoAsync = makeCrudRequest;