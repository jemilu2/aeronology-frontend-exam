import "./TodoItem.css";
import { ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { Checkbox, TextField } from "@mui/material";
import { unstable_createMuiStrictModeTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteTodo, editTodo, iTodo } from "./features/todo/todoSlice";
import { useAppDispatch } from "./app/hooks";
import { useState } from "react";
import { useMutation } from "./features/todo/useMutation";
import { editTodoAsync } from "./features/todo/todoApi";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save"
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";



const theme = unstable_createMuiStrictModeTheme();

function TodoItem({ todo }: { todo: iTodo }) {
  const [editing, setEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState("");
  const [showSuccessSnackBar, setSuccessSnackbarVisibility] = useState(false);
  const [showFailureSnackBar, setFailureSnackbarVisibility] = useState(false);

  const dispatch = useAppDispatch();
  const deleteTodoHandler = () => {
    dispatch(deleteTodo(todo));
  };
  const toggleTodoCompletedState = () => {
    dispatch(editTodo({ ...todo, done: !todo.done }));
  };
  const editTodoHandler = () => {
    setEditingTitle(todo.title);
    setEditing(true);
  };

  const cancelTodoEditingHandler = () => {
    setEditing(false);
    setEditingTitle("");
  };

  const [editTodoExecutor, { data, loading, error, reset }] = useMutation<iTodo>(editTodoAsync as any, editTodo);
  if (data) {
    reset && reset();
    cancelTodoEditingHandler();
    setSuccessSnackbarVisibility(true);
  }

  if (error) {
    reset && reset();
    setFailureSnackbarVisibility(true);
    // cancelTodoEditingHandler();
  }


  const saveTodoHandler = () => {
    editTodoExecutor({ ...todo, title: editingTitle });
  }
  const defaultActions = [
    <Button
      key="edit-action"
      variant="outlined"
      color="secondary"
      className="action-btn"
      disabled={todo.done}
      onClick={editTodoHandler}
    >
      <EditIcon fontSize="small" />
    </Button>,
    <Button
      key="delete-action"
      variant="outlined"
      color="error"
      className="action-btn"
      onClick={deleteTodoHandler}
    >
      <DeleteIcon fontSize="small" color="warning" />
    </Button>,
  ];

  const editingActions = [
    <LoadingButton
      loading={loading}
      loadingPosition="start"
      startIcon={<SaveIcon fontSize="small" />}
      key="save-action"
      variant="outlined"
      color="success"
      className="action-btn"
      onClick={saveTodoHandler}
      disabled={!editingTitle.trim() || loading}
    >
      Save
    </LoadingButton>,
    <Button
      key="cancel-action"
      variant="outlined"
      color="primary"
      className="action-btn"
      onClick={cancelTodoEditingHandler}
    >
      Cancel
    </Button>,
  ];

  const title = !editing ? todo.title : editingTitle;
  return (
    <ThemeProvider theme={theme}>
      <div className="todo-item">
        <Checkbox
          className="todo-checkbox"
          checked={todo.done}
          onChange={toggleTodoCompletedState}
        />
        <TextField
          id="outlined-basic"
          value={title}
          disabled={!editing}
          className="todo-input"
          size="small"
          variant="outlined"
          onChange={(event: any) => setEditingTitle(event?.target.value)}
        />
        {!editing ? defaultActions : editingActions}
      </div>


      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showSuccessSnackBar}
        onClose={() => setSuccessSnackbarVisibility(false)}
        key={"top-right-success"}
        autoHideDuration={5000}
        title="Operation Successful!"
      >
        <MuiAlert
          onClose={() => setSuccessSnackbarVisibility(false)}
          severity={"success"}
          sx={{ width: "100%" }}
        >
          Todo Edited Successfully!
        </MuiAlert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showFailureSnackBar}
        onClose={() => setSuccessSnackbarVisibility(false)}
        key={"top-right-success"}
        autoHideDuration={1000}
        title="Operation Successful!"
      >
        <MuiAlert
          onClose={() => setFailureSnackbarVisibility(false)}
          severity={"error"}
          sx={{ width: "100%" }}
        >
          Todo Editing Failed!
        </MuiAlert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default TodoItem;
