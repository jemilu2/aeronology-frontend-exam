import "./TodoItem.css";
import { ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { Checkbox, TextField } from "@mui/material";
import { unstable_createMuiStrictModeTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteTodo, editTodo, iTodo } from "./features/todo/todoSlice";
import { useAppDispatch } from "./app/hooks";
import { useReducer, useState } from "react";
import { useMutation } from "./features/todo/useMutation";
import { makeCrudRequest as editTodoAsync } from "./features/todo/todoApi";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save"
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export interface iTodoItemState {
  editing: boolean,
  editingTitle: string;
  showSuccessSnackBar: boolean;
  showFailureSnackBar: boolean;
}

export interface iTodoItemAction {
  type: string;
  payload?: any;
}

const initialState = {
  editing: false,
  editingTitle: "",
  showSuccessSnackBar: false,
  showFailureSnackBar: false
};

export function reducer(state: iTodoItemState, action: iTodoItemAction) {
  const { payload } = action;
  switch (action.type) {
    case 'SET_EDITING_TODO_TITLE':
      return { ...state, editingTitle: payload }
    case 'EDIT_TODO':
      return {...state, editingTitle: payload, editing: true };
    case 'CANCEL_EDITING':
      return { ...state, editing: false, editingTitle: "" };
    case 'TODO_EDITED':
      return { ...state, editing: false, editingTitle: "", showSuccessSnackBar: true };
    case 'SET_SUCCESS_SNACKBAR_VISIBILITY':
      return { ...state, editing: false, editingTitle: "", showSuccessSnackBar: payload };
    case 'SET_FAILURE_SNACKBAR_VISIBILITY':
        return { ...state, editing: false, editingTitle: "", showFailureSnackBar: payload };
    case 'HIDE_SUCCESS_SNACKBAR':
      return { ...state, showSuccessSnackBar: false }
    case 'HIDE_FAILURE_SNACKBAR':
        return { ...state, showFailureSnackBar: false }
    default:
      throw new Error();
  }
}

const theme = unstable_createMuiStrictModeTheme();

function TodoItem({ todo }: { todo: iTodo }) {

  const [state, todoItemdispatch] = useReducer(reducer, initialState);
  const { editing, editingTitle, showSuccessSnackBar, showFailureSnackBar } = state;
  const dispatch = useAppDispatch();

  const [editTodoExecutor, { data, loading, error, reset }] = useMutation<iTodo>(editTodoAsync as any, editTodo);
  if (data) {
    reset && reset();
    todoItemdispatch({ type: "TODO_EDITED" })
  }

  if (error) {
    reset && reset();
    todoItemdispatch({ type: "SET_FAILURE_SNACKBAR_VISIBILITY", payload: true })
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
      onClick={() => todoItemdispatch({ type: "EDIT_TODO", payload: todo.title })}
    >
      <EditIcon fontSize="small" />
    </Button>,
    <Button
      key="delete-action"
      variant="outlined"
      color="error"
      className="action-btn"
      onClick={() => dispatch(deleteTodo(todo)) }
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
      onClick={() => todoItemdispatch({ type: "CANCEL_EDITING" })}
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
          onChange={() => dispatch(editTodo({ ...todo, done: !todo.done }))}
        />
        <TextField
          id="outlined-basic"
          value={title}
          disabled={!editing}
          className="todo-input"
          size="small"
          variant="outlined"
          onChange={(event: any) => todoItemdispatch({ type: "SET_EDITING_TODO_TITLE", payload:event.target.value })}
          onKeyPress={(event: React.SyntheticEvent | Event) =>
            (event as any).key === "Enter" &&
            editingTitle && editingTitle.length > 0 &&
            saveTodoHandler()
          }
        />
        {!editing ? defaultActions : editingActions}
      </div>


      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showSuccessSnackBar}
        onClose={() => todoItemdispatch({ type: "HIDE_SUCCESS_SNACKBAR" })}
        key={"top-right-success"}
        autoHideDuration={5000}
        title="Operation Successful!"
      >
        <MuiAlert
          onClose={() => todoItemdispatch({ type: "HIDE_SUCCESS_SNACKBAR" })}
          severity={"success"}
          sx={{ width: "100%" }}
        >
          Todo Edited Successfully!
        </MuiAlert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showFailureSnackBar}
        onClose={() => todoItemdispatch({ type: 'HIDE_FAILURE_SNACKBAR' })}
        key={"top-right-success"}
        autoHideDuration={1000}
        title="Operation Failed!"
      >
        <MuiAlert
          onClose={() => todoItemdispatch({ type: 'HIDE_FAILURE_SNACKBAR' })}
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
