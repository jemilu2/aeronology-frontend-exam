import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import { TextField } from "@mui/material";
import { unstable_createMuiStrictModeTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import TodoItem from "./TodoItem";
import { useAppSelector } from "./app/hooks";
import {  selectTodos } from "./features/todo/todoSlice"; //addTodo,
import { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import {  useTodoMutation } from "./features/todo/useTodoMutation";
import LoadingButton from '@mui/lab/LoadingButton';

const theme = unstable_createMuiStrictModeTheme();

function App() {
  const [title, setTitle] = useState("");
  const [showSnackBar, setSnackbarVisibility] = useState(false);
  const todos = useAppSelector(selectTodos);
  const todoIsValid = !!(title && title.trim().length > 0);

  const closeSnackBarHandler = () => {
    setSnackbarVisibility(false);
  };

  const [addTodo, { data, loading, error }] = useTodoMutation();

  if (loading) console.log("Loading", loading)
  if (error) console.log("error", error);

  useEffect(() => {
    if(todoIsValid) {
      console.log("We probably just added a todo")
    }
    setTitle("")
  }, [todos, todoIsValid])

  const addTodoHandler = async () => {
    if (!todoIsValid) return;
    const newTodo = {
      title: title.trim(),
      id: todos.length + 1,
      deleted: false,
      done: false,
    };
    addTodo(newTodo);
  };
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
            <LoadingButton
              loading={loading}
              loadingPosition="start"
              startIcon={<AddIcon fontSize="small" />}
              variant="outlined"
              className="add-todo-btn"
              onClick={addTodoHandler}
              disabled={!todoIsValid || loading}
            >
              Save
            </LoadingButton>
          </article>
        </div>

        {todos.length > 0 ? (
          <div className="todos-container">
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo}></TodoItem>
            ))}
          </div>
        ) : (
          <h4 style={{ textAlign: "center" }}>Nothing doing?</h4>
        )}
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showSnackBar}
        onClose={closeSnackBarHandler}
        key={"top-right"}
        autoHideDuration={1500}
      >
        <MuiAlert
          onClose={closeSnackBarHandler}
          severity={"success"}
          sx={{ width: "100%" }}
        >
          Todo added successfully
        </MuiAlert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
