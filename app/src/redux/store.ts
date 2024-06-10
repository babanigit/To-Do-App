import { configureStore } from '@reduxjs/toolkit'
import TodoDataReducer from "./todo/TodoSlice"
import  UserDataReducer  from './user/UserSlice'

const store = configureStore({
    reducer: {

        todoDataInfo: TodoDataReducer,

        userDataInfo:UserDataReducer,

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


