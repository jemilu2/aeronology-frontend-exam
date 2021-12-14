import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import { unstable_createMuiStrictModeTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import TodoItem from "./TodoItem";

const theme = unstable_createMuiStrictModeTheme();

function App() {
  const todo: any = {
    title: "Whatever",
    id: 1,
    deleted: false,
    done: true,
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
            />
            <Button variant="outlined" className="add-todo-btn">
              <AddIcon fontSize="small" />
              Add
            </Button>
          </article>
        </div>

        <div className="todos-container">
          <TodoItem todo={todo}></TodoItem>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
