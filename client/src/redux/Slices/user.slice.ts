import { createSlice } from "@reduxjs/toolkit";
import { userReducerInitialState } from "../../types/reducer.types";

const initialState: userReducerInitialState = {
    currentUser: null,
    error: null,
    loading: false,
    isAuthenticated: false,
    isVerified: false,
    isCreator: false,
    normal: false,
    google: false,
    followers: 0,
    following: 0
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        SignupSuccess: (state, action) => {
            state.currentUser = {
                id: action.payload.user.id,
                name: action.payload.user.name,
                email: action.payload.user.email,
                role: action.payload.user.role
            };
            state.error = null;
            state.loading = false;
            state.isAuthenticated = true;
            state.isVerified = true;
            state.isCreator = false;
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
            if(state.currentUser != null && state.currentUser.role == "CREATOR"){
                state.isCreator = true;
            }
        },
        SigninFailure: (state, action) => {
            state.currentUser = null;
            state.error = action.payload;
            state.loading = false;
            state.isAuthenticated = false;
            state.isCreator = false;
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
        },
        UserBecomesCreator: (state) => {
            if(state.currentUser !== null){
                state.currentUser.role = "CREATOR";
            }
            state.isCreator = true;
            state.loading = false;
            state.error = null;
        }
    }
});

export const { SignupFailure, SignupSuccess, SigninFailure, SigninSuccess, UserExist, UserNotExist, UserBecomesCreator } = userSlice.actions;
export default userSlice.reducer;