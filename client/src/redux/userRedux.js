import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: null,
        users: [],
        isFetching: false,
        error: false,
    },
    reducers: {
        loginStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        loginSuccess: (state, action) => {
            state.isFetching = false;
            state.currentUser = action.payload;
            state.error = false;
        },
        loginFailure: (state) => {
            state.error = true; state.isFetching = false;
        },
        //ADD USER
        addUserStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        addUserSuccess: (state, action) => {
            state.isFetching = false;
            state.users.push(action.payload);
            state.error = false;
        },
        addUserFailure: (state) => {
            state.error = true; state.isFetching = false;
        },
        //UPDATE USER
        updateUserStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        updateUserSuccess: (state, action) => {
            state.isFetching = false;
            state.currentUser = action.payload;
            state.users[state.users.findIndex(item => item._id === action.payload.id)] = action.payload;
            state.error = false;
        },
        updateUserFailure: (state) => {
            state.error = true; state.isFetching = false;
        },
        //GET USER
        getUsersStart: (state) => {
            state.isFetching = true;
            state.error = false;
        },
        getUsersSuccess: (state, action) => {
            state.isFetching = false;
            state.users = action.payload;
            state.error = false;
        },
        getUsersFailure: (state) => {
            state.error = true; state.isFetching = false;
        },
        resetState: (state) => {
            state.currentUser = null;
            state.isFetching = false;
            state.error = false;
        }
    },
})

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    resetState,
    addUserStart,
    addUserSuccess,
    addUserFailure,
    getUsersStart,
    getUsersSuccess,
    getUsersFailure,
    updateUserStart,
    updateUserSuccess,
    updateUserFailure
} = userSlice.actions
export default userSlice.reducer