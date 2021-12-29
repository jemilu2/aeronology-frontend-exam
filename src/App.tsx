import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import { Button, TextField } from "@mui/material";
import { unstable_createMuiStrictModeTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import ReplayIcon from "@mui/icons-material/ReplayOutlined"
import TodoItem from "./TodoItem";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { purgeTodos, resetTodo, selectTodos } from "./features/todo/todoSlice"; //addTodo,
import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useTodoMutation } from "./features/todo/useTodoMutation";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from '@mui/material/Typography';

const theme = unstable_createMuiStrictModeTheme();

function App() {
  const [title, setTitle] = useState("");
  const [showSnackBar, setSnackbarVisibility] = useState(false);
  const [showSuccessSnackBar, setSuccessSnackbarVisibility] = useState(false);
  const todos = useAppSelector(selectTodos);
  const dispatch = useAppDispatch()
  const todoIsValid = !!(title && title.trim().length > 0);

  const closeSnackBarHandler = () => {
    setSnackbarVisibility(false);
  };

  const [addTodo, { data, loading, error, reset }] = useTodoMutation();

  if (data) {
    reset && reset();
    setSuccessSnackbarVisibility(true);
  }
  if (error) {
    reset && reset();
    setSnackbarVisibility(true);
  }

  useEffect(() => {
    setTitle("");
  }, [todos]);

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

  const purgeTodoHandler = () => {
    dispatch(resetTodo())
    dispatch(purgeTodos());
  }
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          <Typography variant="h4" gutterBottom component="div">
           Things to do
          </Typography>
        </header>
        <div className="todo-header-container">
          <article className="todo-header">
            <TextField
              id="todo-title-input"
              placeholder="What do you need to do?"
              className="todo-title"
              size="small"
              variant="outlined"
              value={title}
              onInput={(event: any) => setTitle(event.target.value)}
              onKeyPress={(event: React.SyntheticEvent | Event) =>
                (event as any).key === "Enter" &&
                todoIsValid &&
                addTodoHandler()
              }
            />
            <LoadingButton
              loading={loading}
              loadingPosition="start"
              startIcon={<AddIcon fontSize="small" />}
              variant="outlined"
              className="add-todo-btn"
              onClick={addTodoHandler}
              disabled={!todoIsValid || loading}
              id="add-new-todo"
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
          <Typography variant="h5" gutterBottom component="div">
           Nothing to do
          </Typography>
        )}
        <div className="todos-footer" >
          {todos.length > 0 && (
            <Button
              startIcon={<ReplayIcon fontSize="small" />}
              variant="text"
              className="purge-todo-btn"
              onClick={purgeTodoHandler}
              disabled={loading}
              id="add-new-todo"
            >
              Reset
            </Button>
          )}
        </div>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showSnackBar}
        onClose={closeSnackBarHandler}
        key={"top-right-error"}
        autoHideDuration={7000}
      >
        <MuiAlert
          onClose={closeSnackBarHandler}
          severity={"error"}
          sx={{ width: "100%" }}
        >
          We were not able to process your request.
          <br />
          Mock server randomly rejects 20% of the time
        </MuiAlert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showSuccessSnackBar}
        onClose={() => setSuccessSnackbarVisibility(false)}
        key={"top-right-success"}
        autoHideDuration={7000}
        title="Operation Successful!"
      >
        <MuiAlert
          onClose={() => setSuccessSnackbarVisibility(false)}
          severity={"success"}
          sx={{ width: "100%" }}
        >
          Todo Added Successfully!
        </MuiAlert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
