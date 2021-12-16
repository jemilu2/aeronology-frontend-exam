import todoReducer, {
    iTodoState,
    addTodo,
    completeTodo,
    deleteTodo,
    editTodo,
  } from './todoSlice';
  
  describe('counter reducer', () => {
    const initialState: iTodoState = {
      todos: [],
      status: 'idle',
      filter: "ALL"
    };
    it('should handle initial state', () => {
      expect(todoReducer(undefined, { type: 'unknown' })).toEqual({
        todos: [],
        status: 'idle',
        filter: "ALL"
      });
    });
  
    it('should handle addTodo', () => {
      const newTodo = { id: 1, title: "Test addTodo", done: false, deleted: false }
      const actual = todoReducer(initialState, addTodo(newTodo));
      expect(actual.todos).toEqual([newTodo]);
      initialState.todos = actual.todos;
    });

    it('should handle editTodo', () => {
        const newTodo = { id: 1, title: "Edited todo", done: false, deleted: false }
        const actual = todoReducer(initialState, editTodo(newTodo));
        expect(actual.todos).toEqual([newTodo]);
        initialState.todos = actual.todos;
      });

      it('should handle completeTodo', () => {
        const newTodo = { id: 1, title: "Test completeTodo", done: false, deleted: false }
        const actual = todoReducer(initialState, completeTodo(newTodo));
        expect(actual.todos).toEqual([ { ...newTodo, done: true } ]);
      });
  
    it('should handle deleteTodo', () => {
      const newTodo = { id: 1, title: "Test addTodo", done: false, deleted: false }
      const actual = todoReducer(initialState, deleteTodo(newTodo));
      expect(actual.todos).toEqual([]);
    });
  });
  