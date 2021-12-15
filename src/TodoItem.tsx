import "./TodoItem.css";
import { ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { Checkbox, TextField } from "@mui/material";
import { unstable_createMuiStrictModeTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteTodo, iTodo } from "./features/todo/todoSlice";
import { useAppDispatch } from "./app/hooks";

const theme = unstable_createMuiStrictModeTheme();

function TodoItem(props: { todo: iTodo }) {
  const dispatch = useAppDispatch();
  const deleteTodoHandler = () => {
    dispatch(deleteTodo(props.todo))
  }
  const { title, done } = props.todo;
  return (
    <ThemeProvider theme={theme}>
      <div className="todo-item">
        <Checkbox className="todo-checkbox" checked={done} />
        <TextField
          id="outlined-basic"
          value={title}
          disabled={true}
          className="todo-input"
          size="small"
          variant="outlined"
        />
        <Button variant="outlined" color="secondary" className="action-btn">
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
