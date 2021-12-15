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

const theme = unstable_createMuiStrictModeTheme();

function TodoItem({ todo }: { todo: iTodo }) {
  const [editing, setEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState("");
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
  const saveTodoHandler = () => {
    dispatch(editTodo({ ...todo, title: editingTitle }));
    setEditing(false);
    setEditingTitle("");
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
    <Button
      key="save-action"
      variant="outlined"
      color="success"
      className="action-btn"
      onClick={saveTodoHandler}
    >
      Save
    </Button>,
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
    </ThemeProvider>
  );
}

export default TodoItem;
