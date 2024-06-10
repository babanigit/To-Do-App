import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../redux/store";
import { IUserError, IUserModel } from "../../components/modal/userModal";

// Define a type for the slice state
interface IUserDataState {

  currentUser: IUserModel | null;
  loading: boolean;
  error: IUserError | null;
}

// Define the initial state using that type
const initialState: IUserDataState = {

  currentUser: null,
  loading: false,
  error: null,
};

export const UserDataSlice = createSlice({
  name: "userDataInfo",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
   
    loggedInUserRedux: (state, action: PayloadAction<IUserModel | null>) => {
      state.currentUser = action.payload;
    },
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action: PayloadAction<IUserModel>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOut: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
  },
});

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.userDataInfo.currentUser;

export const {
  signInStart,
  signInSuccess,
  signInFailure,

  // updateUserFailure,
  // updateUserStart,
  // updateUserSuccess,
  // deleteUserFailure,
  // deleteUserStart,
  // deleteUserSuccess,

  signOut,
  loggedInUserRedux,
} = UserDataSlice.actions;

export default UserDataSlice.reducer;
