import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { ITodoModel } from '../../components/modal/todoModal'
import { IUserError } from '../../components/modal/userModal'

// Define a type for the slice state
interface ITodoInfoState {
    value: number
    refresh: ITodoModel |null

    currentSingleTodo: ITodoModel | null
    currentTodos : ITodoModel[] 
    todoIdRedux : string

    todoLoadingError:boolean
    todoLoading:boolean
    error:IUserError | null

    showAdd:boolean
    showEdit:boolean
    
}

// Define the initial state using that type
const initialState: ITodoInfoState = {
    value: 0,
    refresh: null,

    currentSingleTodo: null,
    currentTodos:  [],
    todoIdRedux: "",

    todoLoadingError: false,
    todoLoading: false,

    error: null ,

    showAdd:false,
    showEdit:false
}

export const todoInfoSlice = createSlice({
    name: 'todoInfo',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {

        showAddRedux: (state, action: PayloadAction<boolean>) => {
            state.showAdd =action.payload        
          },

        showEditRedux: (state,action: PayloadAction<boolean>) => {
          state.showEdit =action.payload       
        },

        // Use the PayloadAction type to declare the contents of `action.payload`
        incrementByAmount: (state, action: PayloadAction<number>) => {
            state.value += action.payload
        },

        refereshTodo:(state,action: PayloadAction<ITodoModel | null>)=> {
          state.refresh = action.payload
        },

        singleTodo:(state,action: PayloadAction<ITodoModel>)=> {
          state.currentSingleTodo = action.payload
        },

        getTodoIdRedux:(state,action: PayloadAction<string>)=> {
          state.todoIdRedux=action.payload
        },

        preLoad: (state) => {
            state.todoLoadingError = false;
            state.todoLoading=true;
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

          loadFinal:(state)=> {
            state.todoLoading=false
          },


          updateTodoStart: (state) => {
            state.todoLoading = true;
          },
          updateTodoSuccess: (state, action) => {
            state.currentTodos = action.payload;
            state.todoLoading = false;
            state.error = null;
          }, 
          updateTodoFailed: (state, action) => {
            state.todoLoading = false;
            state.error = action.payload;
          },
          
          deleteUserStart: (state) => {
            state.todoLoading = true;
          },
          deleteUserSuccess: (state) => {
            state.currentTodos = [];
            state.todoLoading = false;
            state.error = null;
          },
          deleteUserFailure: (state, action) => {
            state.todoLoading = false;
            state.error = action.payload;
          },
          signOut: (state) => {
            state.currentTodos = [];
            state.todoLoading = false;
            state.error = null;
          },



    },
})

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.todoDataInfo.value

export const {
  preLoad,
  currentAllTodos,
  loadFail,
  loadFinal,

  singleTodo,
  getTodoIdRedux,
  refereshTodo,

  showAddRedux,
  showEditRedux,

  updateTodoFailed,
  updateTodoStart,
  updateTodoSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOut,

} = todoInfoSlice.actions;


export default todoInfoSlice.reducer