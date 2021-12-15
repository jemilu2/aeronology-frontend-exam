import "./TodoItem.css";
import { ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { Checkbox, TextField } from "@mui/material";
import { unstable_createMuiStrictModeTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { completeTodo, deleteTodo, iTodo } from "./features/todo/todoSlice";
import { useAppDispatch } from "./app/hooks";

const theme = unstable_createMuiStrictModeTheme();

function TodoItem({ todo }: { todo: iTodo }) {
  const dispatch = useAppDispatch();
  const deleteTodoHandler = () => {
    dispatch(deleteTodo(todo))
  }
  const completeTodoHandler = () => {
    dispatch(completeTodo(todo));
  }
  const { title, done } = todo;
  return (
    <ThemeProvider theme={theme}>
      <div className="todo-item">
        <Checkbox className="todo-checkbox" checked={done} onChange={completeTodoHandler} disabled={todo.done} />
        <TextField
          id="outlined-basic"
          value={title}
          disabled={true}
          className="todo-input"
          size="small"
          variant="outlined"
        />
        <Button variant="outlined" color="secondary" className="action-btn" disabled={todo.done}>
          <EditIcon fontSize="small" />
        </Button>
        <Button variant="outlined" color="error" className="action-btn" onClick={deleteTodoHandler}>
          <DeleteIcon fontSize="small" color="warning" />
        </Button>
      </div>
    </ThemeProvider>
  );
}

export default TodoItem;
