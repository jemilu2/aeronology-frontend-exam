import { iTodo } from "./todoSlice";

let requests = 0;
let failedRequests = 0;

// A mock function to mimic making an async request for data
export function addTodoAsync(todo: iTodo) {
  requests++
  return new Promise<{ data: iTodo }>((resolve, reject) =>
    setTimeout(() => {
      const failureRatio = failedRequests / requests;
      if (failureRatio < 0.2) {
        failedRequests++;
        return reject("We were not able to process your request.Mock server randomly rejects 20% of the time");
      }
      resolve({ data: todo })
    }, 800)
  );
}
