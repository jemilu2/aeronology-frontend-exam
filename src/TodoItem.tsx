import "./TodoItem.css";
import { ThemeProvider } from "@mui/material/styles";
// import { createTheme } from '@mui/system';
import Button from "@mui/material/Button";
import { Checkbox, TextField } from "@mui/material";
import { unstable_createMuiStrictModeTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const theme = unstable_createMuiStrictModeTheme();

export interface iTodo {
  id: number;
  title: string;
  done: boolean;
  deleted: boolean;
}

function TodoItem(props: { todo: iTodo }) {
  const { id, title, done, deleted } = props.todo;
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
        <Button variant="outlined" color="error" className="action-btn">
          <DeleteIcon fontSize="small" color="warning" />
        </Button>
      </div>
    </ThemeProvider>
  );
}

export default TodoItem;
