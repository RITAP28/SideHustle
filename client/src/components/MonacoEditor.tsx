import { Editor } from "@monaco-editor/react";
import { useRef, useState } from "react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../utils/constants";
import CodeOutput from "./code.output";
import * as monaco from "monaco-editor";

const MonacoEditor = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [value, setValue] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const onMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.focus();
  };
  const handleChange = (newValue: string) => {
    setValue(newValue);
  };
  const onSelect = (language: string) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  return (
    <div className="pt-[2rem]">
      <div className="flex flex-row mx-4 gap-2">
        <div className="basis-1/2 w-full">
          <div className="basis-1/2 justify-start w-full py-2 ml-4">
            <LanguageSelector language={language} onSelect={onSelect} />
          </div>
          <Editor
            language={language}
            defaultValue={CODE_SNIPPETS[language]}
            height="60vh"
            theme="vs-dark"
            value={value}
            onMount={onMount}
            onChange={() => {
              handleChange;
            }}
          />
        </div>
        <div className="basis-1/2 w-full text-white">
          <CodeOutput editorRef={editorRef} language={language} />
        </div>
      </div>
    </div>
  );
};

export default MonacoEditor;
