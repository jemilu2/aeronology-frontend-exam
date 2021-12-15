import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface iTodo {
    id: number;
    title: string;
    done: boolean;
    deleted: boolean;
  }

export type TodoFilter = "ALL" | "DONE" | "DELETED"

export interface iTodoState {
    todos: iTodo[];
    filter: TodoFilter;
}

const initialState: iTodoState = {
    todos: [
        { id: 1, title: "Type that letter", done: false, deleted: false },
        { id: 2, title: "Call cupcake", done: true, deleted: false },
        { id: 3, title: "Make that prototype", done: false, deleted: false },
        { id: 4, title: "Call the police", done: false, deleted: false },
    ],
    filter: "ALL"
    // TODO: wipe those defaults out
}

export const todoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        addTodo: (state: iTodoState, action: PayloadAction<iTodo>) => {
            state.todos.push(action.payload)
        },
        deleteTodo: (state: iTodoState, action: PayloadAction<iTodo>) =>  {
            const index = state.todos.map((todo: iTodo) => todo.id).indexOf(action.payload.id)
            if(index !== -1) {
                state.todos.splice(index)
            }
        },
        completeTodo: (state: iTodoState, action: PayloadAction<iTodo>) =>  {
            const { payload: todo } = action;
            todo.done = true;
            const index = state.todos.map((todo: iTodo) => todo.id).indexOf(action.payload.id)
            if(index !== -1) {
                state.todos.splice(index, 1, todo)
            }
        },
        editTodo: (state: iTodoState, action: PayloadAction<iTodo>) =>  {
            const { payload: todo } = action;
            const index = state.todos.map((todo: iTodo) => todo.id).indexOf(todo.id)
            if(index !== -1) {
                state.todos.splice(index, 1, todo)
            }
        }
    }
})

// action creators derived from 
export const { addTodo, deleteTodo, completeTodo, editTodo } = todoSlice.actions;

// Just a few computed properties

export const selectTodos = (state: RootState) => state.todo.todos;
export const selectCompletedTodos = (state: RootState) => state.todo.todos.filter((todo: iTodo) => todo.done);
export const selectDeletedTodos = (state: RootState) => state.todo.todos.filter((todo: iTodo) => todo.deleted);

export default todoSlice.reducer;