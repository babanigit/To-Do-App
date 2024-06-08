import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counter/counterSlice'
import dataInfoReducer from "./dataInfo/dataInfoSlice"
import  UserDataSlice  from './user/UserSlice'

const store = configureStore({
    reducer: {

        counter: counterReducer,

        dataInfo: dataInfoReducer,

        userDataInfo:UserDataSlice,

        //   posts: postsReducer,
        //   comments: commentsReducer,
        //   users: usersReducer,

    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;


