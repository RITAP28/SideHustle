import { Editor } from "@monaco-editor/react";
import { useRef, useState } from "react";
import LanguageSelector from "./LanguageSelector";

const MonacoEditor = () => {
  const editorRef = useRef(null);
  const [value, setValue] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const onMount = (editor: any) => {
    editorRef.current = editor;
    editor.focus();
  };
  const handleChange = (newValue: string) => {
    setValue(newValue);
  };
  const onSelect = (language: string) => {
    setLanguage(language);
  };

  return (
    <div>
      <div className="py-2 ml-4">
        <LanguageSelector language={language} onSelect={onSelect} />
      </div>
      <div className="">
        <div className="w-1/2">
          <Editor
            language={language}
            defaultValue="// some code here"
            height="60vh"
            theme="vs-dark"
            value={value}
            onMount={onMount}
            onChange={() => {
              handleChange;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MonacoEditor;
