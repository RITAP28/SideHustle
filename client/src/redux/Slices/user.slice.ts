import { createSlice } from "@reduxjs/toolkit";
import { userReducerInitialState } from "../../types/reducer.types";

const initialState: userReducerInitialState = {
    currentUser: null,
    error: null,
    loading: false,
    isAuthenticated: false,
    isVerified: false,
    normal: false,
    google: false
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        SignupSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.error = null;
            state.loading = false;
            state.isAuthenticated = true;
            state.isVerified = true;
        },
        SignUpInitial: (state, action) => {
            state.currentUser = action.payload;
            state.error = null;
            state.loading = false;
            state.isAuthenticated = true;
            state.isVerified = false;
        },
        UserExist: (state, action) => {
            state.currentUser = action.payload;
            state.error = null;
            state.loading = false;
            state.isAuthenticated = true;
        },
        SigninSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.error = null;
            state.loading = false;
            state.isAuthenticated = true;
            state.isVerified = true;
        },
        SigninFailure: (state, action) => {
            state.currentUser = null;
            state.error = action.payload;
            state.loading = false;
            state.isAuthenticated = false;
        },
        UserNotExist: (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false;
            state.isAuthenticated = false;
            state.isVerified = false;
        },
        SignupFailure: (state, action) => {
            state.currentUser = null;
            state.error = action.payload;
            state.loading = false;
            state.isAuthenticated = false;
        }
    }
});

export const { SignupFailure, SignupSuccess, SigninFailure, SigninSuccess, UserExist, UserNotExist, SignUpInitial } = userSlice.actions;
export default userSlice.reducer;