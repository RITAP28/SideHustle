import { User } from "./types";

export interface userReducerInitialState {
    currentUser: User | null;
    error: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    normal: boolean;
    google: boolean;
}