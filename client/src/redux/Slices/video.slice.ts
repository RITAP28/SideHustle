import { createSlice } from "@reduxjs/toolkit";
import { videoReducerInitialState } from "../../types/reducer.types";

const initialState: videoReducerInitialState = {
    currentVideo: null,
    error: null,
    loading: false,
};

export const videoSlice = createSlice({
    name: 'video',
    initialState,
    reducers: {
        CurrentVideo: (state, action) => {
            state.currentVideo = action.payload;
            state.error = null;
            state.loading = false;
        }
    }
});

export const { CurrentVideo } = videoSlice.actions;
export default videoSlice.reducer;