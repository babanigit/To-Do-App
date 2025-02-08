import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createAction,
} from "@reduxjs/toolkit";

import type { RootState } from "../store";
import { ITodoModel } from "../../components/modal/todoModal";
import { IUserError } from "../../components/modal/userModal";

import * as API from "../../components/network/fetchApi";

// Define a type for the slice state
interface ITodoInfoState {
  currentSingleTodo: ITodoModel | null;
  currentTodos: ITodoModel[];
  deletedTodo: ITodoModel | null;

  todoLoadingError: boolean;
  todoLoading: boolean;
  error: IUserError | null;

  showAdd: boolean;
  showEdit: boolean;

  refresh: boolean;
}

// Define the initial state using that type
const initialState: ITodoInfoState = {
  currentSingleTodo: null,
  currentTodos: [],
  deletedTodo: null,

  todoLoadingError: false,
  todoLoading: false,

  error: null,

  showAdd: false,
  showEdit: false,

  refresh: false,
};

// fetch todo redux thunk
//actions
export const fetchTodo = createAsyncThunk("fetchTodos", async () => {
  const todos = await API.fetchTodos();
  return todos;
});

// Define the fetchTodoRejected action creator with the payload type IUserError
const fetchTodoRejected = createAction<IUserError | null>("fetchTodo/rejected");

const fetchTodoPending = createAction<ITodoModel[] | []>("fetchTodo/pending");

// deleteTodo redux thunk
export const deleteTodo = createAsyncThunk(
  "deleteTodo",
  async (todoId: string) => {
    const todoDelete = await API.deleteTodos(todoId);
    return todoDelete;
  }
);

const deleteTodoFulfilled = createAction<ITodoModel | null>(
  "deleteTodo/fulfilled"
);

export const todoInfoSlice = createSlice({
  name: "todoInfo",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,

  extraReducers: (builder) => {
    builder.addCase(fetchTodoPending, (state, action) => {
      state.todoLoading = true;
      state.todoLoadingError = false;

      state.currentTodos = action.payload;
    });

    builder.addCase(
      fetchTodo.fulfilled,
      (state, action: PayloadAction<ITodoModel[] | []>) => {
        state.todoLoading = false;
        state.currentTodos = action.payload;
      }
    );

    builder.addCase(fetchTodoRejected, (state, action) => {
      state.todoLoadingError = true;
      state.error = action.payload;
    });

    builder.addCase(deleteTodo.pending, (state) => {
      state.todoLoading = true;
      // state.todoLoadingError = false;

      // state.deletedTodo=action.payload;
    });

    builder.addCase(
      deleteTodoFulfilled,
      (state, action: PayloadAction<ITodoModel | null>) => {
        state.todoLoading = false;
        state.deletedTodo = action.payload;
      }
    );
  },

  reducers: {
    showAddRedux: (state, action: PayloadAction<boolean>) => {
      state.showAdd = action.payload;
    },

    showEditRedux: (state, action: PayloadAction<boolean>) => {
      state.showEdit = action.payload;
    },

    singleTodo: (state, action: PayloadAction<ITodoModel>) => {
      state.currentSingleTodo = action.payload;
    },

    preLoad: (state) => {
      state.todoLoadingError = false;
      state.todoLoading = true;
    },
    currentAllTodos: (state, action: PayloadAction<ITodoModel[]>) => {
      state.currentTodos = action.payload;
      // state.todoLoadingError = false;
      // state.todoLoading=true
      state.error = null;
    },
    loadFail: (state, action) => {
      state.todoLoadingError = true;
      state.error = action.payload;
    },

    loadFinal: (state) => {
      state.todoLoading = false;
    },

    updateTodoStart: (state) => {
      state.todoLoading = true;
    },
    updateTodoSuccess: (state, action) => {
      state.currentSingleTodo = action.payload;
      state.todoLoading = false;
      state.error = null;
    },
    updateTodoFailed: (state, action) => {
      state.todoLoading = false;
      state.error = action.payload;
    },
    deleteSuccess: (state) => {
      state.deletedTodo = null;
    },
  },
});

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) =>
  state.todoDataInfo.currentTodos;

export const {
  preLoad,
  currentAllTodos,
  loadFail,
  loadFinal,

  singleTodo,
  showAddRedux,
  showEditRedux,

  updateTodoFailed,
  updateTodoStart,
  updateTodoSuccess,
  deleteSuccess,
} = todoInfoSlice.actions;

export default todoInfoSlice.reducer;
