import * as monaco from "monaco-editor";

export type User = {
    id: number;
    name: string;
    email: string;
    role: string;
}

export type Video = {
    id: string;
    title: string;
    dateOfPublishing: Date;
    link: string;
    thumbnail: string;
    description: string;
    publisherId: number;
    refreshingComments: boolean;
    comments: number;
}

export type EditorRef = React.RefObject<monaco.editor.IStandaloneCodeEditor | null>