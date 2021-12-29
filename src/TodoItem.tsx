import "./TodoItem.css";
import { ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { Checkbox, TextField } from "@mui/material";
import { unstable_createMuiStrictModeTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteTodo, editTodo, iTodo } from "./features/todo/todoSlice";
import { useAppDispatch } from "./app/hooks";
import { useReducer } from "react";
import { useMutation } from "./features/todo/useMutation";
import { makeCrudRequest as editTodoAsync } from "./features/todo/todoApi";
import { makeCrudRequest as deleteTodoAsync } from "./features/todo/todoApi";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export interface iTodoItemState {
  editing: boolean;
  editingTitle: string;
  showSuccessSnackBar: boolean;
  showFailureSnackBar: boolean;
  successSnackbarMessage: string;
  failureSnackbarMessage: string;
}

export interface iTodoItemAction {
  type: TodoAction;
  payload?: any;
}

enum TodoAction {
  SET_EDITING_TODO_TITLE = "SET_EDITING_TODO_TITLE",
  EDIT_TODO = "EDIT_TODO",
  CANCEL_EDITING = "CANCEL_EDITING",
  TODO_EDITED = "TODO_EDITED",
  SET_SUCCESS_SNACKBAR_VISIBILITY = "SET_SUCCESS_SNACKBAR_VISIBILITY",
  SHOW_FAILURE_SNACKBAR = "SHOW_FAILURE_SNACKBAR",
  HIDE_SUCCESS_SNACKBAR = "HIDE_SUCCESS_SNACKBAR",
  HIDE_FAILURE_SNACKBAR = "HIDE_FAILURE_SNACKBAR",
  TODO_DELETED="TODO_DELETED"
}

const initialState = {
  editing: false,
  editingTitle: "",
  showSuccessSnackBar: false,
  showFailureSnackBar: false,
  successSnackbarMessage: "",
  failureSnackbarMessage: "",
};

export function reducer(state: iTodoItemState, action: iTodoItemAction) {
  const { payload } = action;
  switch (action.type) {
    case TodoAction.SET_EDITING_TODO_TITLE:
      return { ...state, editingTitle: payload };
    case TodoAction.EDIT_TODO:
      return { ...state, editingTitle: payload, editing: true };
    case TodoAction.CANCEL_EDITING:
      return { ...state, editing: false, editingTitle: "" };
    case TodoAction.TODO_EDITED:
      return {
        ...state,
        editing: false,
        editingTitle: "",
        showSuccessSnackBar: true,
        successSnackbarMessage: "Todo edited successfully",
      };
      case TodoAction.TODO_DELETED:
        return {
          ...state,
          showSuccessSnackBar: true,
          successSnackbarMessage: "Todo deleted successfully",
        };
    case TodoAction.SET_SUCCESS_SNACKBAR_VISIBILITY:
      return {
        ...state,
        editing: false,
        editingTitle: "",
        showSuccessSnackBar: payload,
      };
    case TodoAction.SHOW_FAILURE_SNACKBAR:
      return {
        ...state,
        showFailureSnackBar: true,
        failureSnackbarMessage: payload,
      };
    case TodoAction.HIDE_SUCCESS_SNACKBAR:
      return { ...state, showSuccessSnackBar: false };
    case TodoAction.HIDE_FAILURE_SNACKBAR:
      return { ...state, showFailureSnackBar: false };
    default:
      throw new Error();
  }
}

const theme = unstable_createMuiStrictModeTheme();

function TodoItem({ todo }: { todo: iTodo }) {
  const [state, todoItemdispatch] = useReducer(reducer, initialState);
  const { editing, editingTitle, showSuccessSnackBar, showFailureSnackBar } =
    state;
  const dispatch = useAppDispatch();

  const [editTodoExecutor, { data, loading, error, reset }] =
    useMutation<iTodo>(editTodoAsync as any, editTodo);
  const [
    deleteTodoExecutor,
    {
      data: deleteData,
      loading: deleteLoading,
      error: deletingError,
      reset: deletingReset,
    },
  ] = useMutation<iTodo>(deleteTodoAsync as any, deleteTodo);
  if (data) {
    reset && reset();
    todoItemdispatch({ type: TodoAction.TODO_EDITED });
  }

  if(deleteData) {
    deletingReset && deletingReset();
    todoItemdispatch({ type: TodoAction.TODO_DELETED });
  }

  if (error || deletingError) {
    reset && reset();
    deletingReset && deletingReset();
    todoItemdispatch({
      type: TodoAction.SHOW_FAILURE_SNACKBAR,
      payload: error || deletingError,
    });
  }

  const saveTodoHandler = () => {
    editTodoExecutor({ ...todo, title: editingTitle });
  };

  const defaultActions = [
    <Button
      key="edit-action"
      variant="outlined"
      color="secondary"
      className="action-btn"
      disabled={todo.done}
      onClick={() =>
        todoItemdispatch({ type: TodoAction.EDIT_TODO, payload: todo.title })
      }
    >
      <EditIcon fontSize="small" />
    </Button>,
    <LoadingButton
      loading={deleteLoading}
      loadingPosition="start"
      key="delete-action"
      variant="outlined"
      color="error"
      className="action-btn"
      onClick={() => deleteTodoExecutor(todo)}
    >
      <DeleteIcon fontSize="small" color="warning" />
    </LoadingButton>,
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
      onClick={() => todoItemdispatch({ type: TodoAction.CANCEL_EDITING })}
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
          onChange={() => editTodoExecutor({ ...todo, done: !todo.done })}
        />
        <TextField
          id="outlined-basic"
          value={title}
          disabled={!editing}
          className="todo-input"
          size="small"
          variant="outlined"
          onChange={(event: any) =>
            todoItemdispatch({
              type: TodoAction.SET_EDITING_TODO_TITLE,
              payload: event.target.value,
            })
          }
          onKeyPress={(event: React.SyntheticEvent | Event) =>
            (event as any).key === "Enter" &&
            editingTitle &&
            editingTitle.length > 0 &&
            saveTodoHandler()
          }
        />
        {!editing ? defaultActions : editingActions}
      </div>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showSuccessSnackBar}
        onClose={() =>
          todoItemdispatch({ type: TodoAction.HIDE_SUCCESS_SNACKBAR })
        }
        key={"top-right-success"}
        autoHideDuration={5000}
        title="Operation Successful!"
      >
        <MuiAlert
          onClose={() =>
            todoItemdispatch({ type: TodoAction.HIDE_SUCCESS_SNACKBAR })
          }
          severity={"success"}
          sx={{ width: "100%" }}
        >
          {state.successSnackbarMessage}
        </MuiAlert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showFailureSnackBar}
        onClose={() =>
          todoItemdispatch({ type: TodoAction.HIDE_FAILURE_SNACKBAR })
        }
        key={"top-right-failure"}
        autoHideDuration={5000}
        title="Operation Failed!"
      >
        <MuiAlert
          onClose={() =>
            todoItemdispatch({ type: TodoAction.HIDE_FAILURE_SNACKBAR })
          }
          severity={"error"}
          sx={{ width: "100%" }}
        >
          {state.failureSnackbarMessage}
        </MuiAlert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default TodoItem;
