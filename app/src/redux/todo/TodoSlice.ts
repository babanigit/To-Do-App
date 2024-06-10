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

//actions
export const fetchTodo = createAsyncThunk("fetchTodos", async () => {
  const todos = await API.fetchTodos();
  return todos;
});

// Define a type for the slice state
interface ITodoInfoState {
  currentSingleTodo: ITodoModel | null;
  currentTodos: ITodoModel[];

  todoLoadingError: boolean;
  todoLoading: boolean;
  error: IUserError | null;

  showAdd: boolean;
  showEdit: boolean;
}

// Define the initial state using that type
const initialState: ITodoInfoState = {
  currentSingleTodo: null,
  currentTodos: [],

  todoLoadingError: false,
  todoLoading: false,

  error: null,

  showAdd: false,
  showEdit: false,
};

// Define the fetchTodoRejected action creator with the payload type IUserError
const fetchTodoRejected = createAction<IUserError | null>("fetchTodo/rejected");

const fetchtodoPending = createAction<ITodoModel[] | []>("fetchTodo/pending");

export const todoInfoSlice = createSlice({
  name: "todoInfo",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,

  extraReducers: (builder) => {
    builder.addCase(fetchtodoPending, (state, action) => {
      state.todoLoading = true;
      state.currentTodos=action.payload;
    });

    builder.addCase(
      fetchTodo.fulfilled,
      (state, action: PayloadAction<ITodoModel[]|[]>) => {
        state.todoLoading = false;
        state.todoLoadingError=false
        state.currentTodos = action.payload;
      }
    );

    builder.addCase(fetchTodoRejected, (state, action) => {
      state.todoLoadingError = true;
      state.error = action.payload;
    });
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
} = todoInfoSlice.actions;

export default todoInfoSlice.reducer;
