import { User, Video } from "./types";

export interface userReducerInitialState {
    currentUser: User | null;
    error: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    normal: boolean;
    google: boolean;
}

export interface videoReducerInitialState {
    currentVideo: Video | null;
    error: string | null;
    loading: boolean;
}