import { Editor } from "@monaco-editor/react";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

interface fileProps {
  filename: string;
  template: string;
  content: string;
  username: string;
  userId: number;
}

const CodeEditor = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = Number(urlParams.get("userId"));
  const filename = String(urlParams.get("filename"));

  const [file, setFile] = useState<fileProps>();
  const [loading, setLoading] = useState<boolean>(false);

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

  return (
    <>
      {loading ? (
        "loading..."
      ) : (
        <div className="w-full min-h-screen bg-red-300">
          <Editor
            language={file ? `${file.template}` : "javascript"}
            defaultValue={file ? `${file.content}` : `${userId}${filename}`}
            className="w-full h-full"
            theme="vs-dark"
            height="90vh"
          />
        </div>
      )}
    </>
  );
};

export default CodeEditor;
