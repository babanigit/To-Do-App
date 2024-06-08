import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../redux/store'


// Define a type for the slice state
interface IUserDataState {
    value: number

    currentUser :unknown
    loading:boolean
    error:boolean
    
}

// Define the initial state using that type
const initialState: IUserDataState = {
    value: 0,

    
    currentUser: null,
    loading: false,
    error: false,
}




export const UserDataSlice = createSlice({
    name: 'userDataInfo',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {

        increment: (state) => {
            state.value += 1
        },
        decrement: (state) => {
            state.value -= 1
        },
        // Use the PayloadAction type to declare the contents of `action.payload`
        incrementByAmount: (state, action: PayloadAction<number>) => {
            state.value += action.payload
        },


        signInStart: (state) => {
            state.loading = true;
          },
          signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
          },
          signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
          },


          updateUserStart: (state) => {
            state.loading = true;
          },
          updateUserSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = false;
          },
          updateUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
          },
          deleteUserStart: (state) => {
            state.loading = true;
          },
          deleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = false;
          },
          deleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
          },
          signOut: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = false;
          },




    },
})


// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state.dataInfo.value

export default UserDataSlice.reducer