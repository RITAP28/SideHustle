import { Editor } from "@monaco-editor/react";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { CODE_SNIPPETS } from "../../utils/constants";
import * as monaco from "monaco-editor";

interface fileProps {
  filename: string;
  template: string;
  content: string;
  version: string;
  username: string;
  userId: number;
}

const defaultCode = CODE_SNIPPETS;

const CodeEditor = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = Number(urlParams.get("userId"));
  const filename = String(urlParams.get("filename"));

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const [file, setFile] = useState<fileProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [, setChangedContent] = useState<string>("");
  const [running, setRunning] = useState<boolean>(false);

  const handleGetFileByFilename = useCallback(async () => {
    setLoading(true);
    try {
      const file = await axios.get(
        `http://localhost:7070/getfile?userId=${userId}&filename=${filename}`,
        {
          withCredentials: true,
        }
      );
      console.log(file.data);
      setFile(file.data.file);
    } catch (error) {
      console.error("Error getting this specific file: ", error);
    }
    setLoading(false);
  }, [userId, filename]);

  useEffect(() => {
    handleGetFileByFilename();
  }, [handleGetFileByFilename]);

  const onMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleChangeContent = (value: string | undefined) => {
    console.log(value as string);
    setChangedContent(value as string);
  };

  const handleRunCode = async () => {
    setRunning(true);
    try {
      if (editorRef.current !== null) {
        const sourceCode = editorRef.current.getValue();
        console.log(file?.version);
        if (!sourceCode) return;
        const codeOutput = await axios.post(
          "https://emkc.org/api/v2/piston/execute",
          {
            language: file ? file.template : "javascript",
            version: file ? file.version : "18.15.0",
            files: [
              {
                content: sourceCode,
              },
            ],
          }
        );
        console.log(codeOutput.data);
      }
    } catch (error) {
      console.error("Error running code: ", error);
    }
    setRunning(false);
  };

  return (
    <>
      {loading ? (
        "loading..."
      ) : (
        <>
          <div className="w-full flex justify-center">
            <button
              type="button"
              className="px-4 py-1 font-Code font-bold bg-black text-white hover:bg-white hover:text-black hover:cursor-pointer border-2 border-white"
              onClick={handleRunCode}
              disabled={running}
            >
              {running ? "Running..." : "Run"}
            </button>
          </div>
          <div className="w-full min-h-screen bg-red-300">
            <Editor
              language={file ? `${file.template}` : "javascript"}
              defaultValue={
                file
                  ? `${defaultCode[file.template]}`
                  : `null`
              }
              className="w-full h-full"
              theme="vs-dark"
              height="90vh"
              onMount={onMount}
              onChange={handleChangeContent}
            />
          </div>
        </>
      )}
    </>
  );
};

export default CodeEditor;
