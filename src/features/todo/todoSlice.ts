import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';
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
    status: "loading" | "idle" | "error";
}

const initialState: iTodoState = {
    todos: [],
    filter: "ALL",
    status: "idle"
}

export const todoSlice = createSlice({
    name: "todo",
    initialState,
    reducers: {
        addTodo: (state: iTodoState, action: PayloadAction<iTodo>) => {
            state.todos.push(action.payload)
        },
        deleteTodo: (state: iTodoState, action: PayloadAction<iTodo>) => {
            const index = state.todos.map((todo: iTodo) => todo.id).indexOf(action.payload.id)
            if (index !== -1) {
                state.todos.splice(index, 1)
            }
        },
        completeTodo: (state: iTodoState, action: PayloadAction<iTodo>) => {
            const { payload: todo } = action;
            const index = state.todos.map((todo: iTodo) => todo.id).indexOf(action.payload.id)
            if (index !== -1) {
                state.todos.splice(index, 1, { ...todo, done: true })
            }
        },
        editTodo: (state: iTodoState, action: PayloadAction<iTodo>) => {
            const { payload: todo } = action;
            const index = state.todos.map((todo: iTodo) => todo.id).indexOf(todo.id)
            if (index !== -1) {
                state.todos.splice(index, 1, todo)
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(PURGE, (state) => {
            state.todos = [];
        });
    }
})

// action creators derived from 
export const { addTodo, deleteTodo, completeTodo, editTodo } = todoSlice.actions;

export const purgeTodos = createAction("persist/PURGE")

// Just a few computed properties

export const selectTodos = (state: RootState) => state.todo.todos;
export const selectCompletedTodos = (state: RootState) => state.todo.todos.filter((todo: iTodo) => todo.done);
export const selectDeletedTodos = (state: RootState) => state.todo.todos.filter((todo: iTodo) => todo.deleted);

export default todoSlice.reducer;