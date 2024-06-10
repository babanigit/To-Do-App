import { createAction, createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../redux/store";
import { IUserError, IUserModel } from "../../components/modal/userModal";

import * as API from "../../components/network/fetchApi";

//actions
export const fetchLoggedInUser = createAsyncThunk("fetchLoggedInUser", async () => {
  const user = await API.getLoggedInUser();
  return user;
});

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

// Define the fetchUserRejected action creator with the payload type IUserError
const fetchUserRejected = createAction<IUserError | null>("fetchLoggedInUser/rejected");

const fetchUserPending = createAction<IUserModel | null>("fetchLoggedInUser/pending");

export const UserDataSlice = createSlice({
  name: "userDataInfo",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,

  extraReducers: (builder) => {

    builder.addCase(fetchUserPending, (state, action ) => {
      state.loading = true;
      state.currentUser =action.payload;
    });

    builder.addCase(
      fetchLoggedInUser.fulfilled,
      (state, action: PayloadAction<IUserModel>) => {
        state.loading = false;
        state.currentUser = action.payload;
      }
    );

    builder.addCase(fetchUserRejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },

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

  signOut,
  loggedInUserRedux,
} = UserDataSlice.actions;

export default UserDataSlice.reducer;
