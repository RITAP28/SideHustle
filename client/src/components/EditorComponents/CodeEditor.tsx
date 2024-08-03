import { Editor } from "@monaco-editor/react";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
// import { CODE_SNIPPETS } from "../../utils/constants";
import * as monaco from "monaco-editor";
import { useToast } from "@chakra-ui/react";
import { FaPlay } from "react-icons/fa";

interface fileProps {
  filename: string;
  template: string;
  content: string;
  version: string;
  username: string;
  userId: number;
}

// const defaultCode = CODE_SNIPPETS;

const CodeEditor = () => {
    const toast = useToast();
  const urlParams = new URLSearchParams(window.location.search);
  const userId = Number(urlParams.get("userId"));
  const filename = String(urlParams.get("filename"));

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const [file, setFile] = useState<fileProps | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [, setChangedContent] = useState<string>("");
  const [running, setRunning] = useState<boolean>(false);
  const [output, setOutput] = useState<string>("Run Code to see output!");

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
    setChangedContent(value as string);
  };

  const handleRunCode = async () => {
    setRunning(true);
    try {
      if (editorRef.current !== null) {
        const sourceCode = editorRef.current.getValue();
        console.log(file?.version);
        if (!sourceCode) return;
        const codeOutput = await axios.put(
          "http://localhost:7070/run",
          {
            fullName: file && file.filename,
            language: file && file.template,
            version: file && file.version,
            content: sourceCode,
            userId: userId
          }, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        console.log(codeOutput.data);
        toast({
            title: "Code execution successfull",
            description: "Your code has been executed successfully, you can see the output on the right side of the screen",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        setOutput(codeOutput.data.output);
      }
    } catch (error) {
      console.error("Error running code: ", error);
    }
    setRunning(false);
  };

  return (
    <>
      <div className="w-full flex flex-row gap-1 min-h-screen">
      <div className="w-[60%]">
      {loading ? (
        "loading..."
      ) : (
        <>
          <div className="w-full flex justify-center">
            <button
              type="button"
              className="px-4 py-1 font-Code font-bold bg-green-800 text-white hover:bg-green-600 hover:cursor-pointer rounded-md"
              onClick={handleRunCode}
              disabled={running}
            >
              <span className="flex flex-row items-center gap-2">
                <FaPlay className="text-[0.75rem]" />
                {running ? "Running..." : "Run"}
              </span>
            </button>
          </div>
          <div className="w-full pt-2">
            <Editor
              language={file ? `${file.template}` : "javascript"}
              defaultValue={
                file
                  ? `${file.content}`
                  : `null`
              }
              className="w-full h-full"
              theme="vs-dark"
              height="70vh"
              onMount={onMount}
              onChange={handleChangeContent}
            />
          </div>
        </>
      )}
      </div>
      <div className="w-[40%] bg-gray-800 border-2 border-white h-[70vh] mt-11 p-4 text-white font-Code overflow-y-scroll">
        {running ? "Running your code..." : output}
      </div>
      </div>
    </>
  );
};

export default CodeEditor;
