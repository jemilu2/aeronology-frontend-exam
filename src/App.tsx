import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { unstable_createMuiStrictModeTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import TodoItem from "./TodoItem";
import { useAppSelector, useAppDispatch } from "./app/hooks";
import { addTodo, selectTodos } from "./features/todo/todoSlice";
import { useState } from "react";

const theme = unstable_createMuiStrictModeTheme();

function App() {
  const todos = useAppSelector(selectTodos);
  const [title, setTitle] = useState("");
  const dispatch = useAppDispatch();

  const addTodoHandler = () => {
    const newTodo = {
      title,
      id: todos.length + 1,
      deleted: false,
      done: false
    }
    dispatch(addTodo(newTodo))
    setTitle("");
  }
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          <h2 style={{ textAlign: "center" }}>Things to do</h2>
        </header>
        <div className="todo-header-container">
          <article className="todo-header">
            <TextField
              id="outlined-basic"
              placeholder="What do you need to do?"
              className="todo-title"
              size="small"
              variant="outlined"
              value={title}
              onInput={(event: any) => setTitle(event.target.value)}
            />
            <Button variant="outlined" className="add-todo-btn" onClick={addTodoHandler}>
              <AddIcon fontSize="small" />
              Add
            </Button>
          </article>
        </div>

        <div className="todos-container">
          { todos.map((todo) => <TodoItem key={todo.id} todo={todo}></TodoItem>) }
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
