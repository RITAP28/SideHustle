import { EditorRef, User, Video } from "./types";

export interface userReducerInitialState {
    currentUser: User | null;
    error: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    isVerified: boolean;
    isCreator: boolean;
    normal: boolean;
    google: boolean;
    followers: number;
    following: number;
}

export interface videoReducerInitialState {
    currentVideo: Video | null;
    error: string | null;
    loading: boolean;
}

export interface CodeOutput {
    editorRef: EditorRef;
    language: string;
}