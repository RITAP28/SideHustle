import { Editor } from "@monaco-editor/react";
import { useRef, useState } from "react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS, LANGUAGE_VERSIONS } from "../utils/constants";
import * as monaco from "monaco-editor";
import axios from "axios";

const MonacoEditor = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [value, setValue] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const [activeTab, setActiveTab] = useState<string>("code");
  const [, setInactivetab] = useState<string>("");
  const [activeRunButton, setActiveRunButton] = useState<boolean>(true);
  const [activeOutputButton, setActiveOutputButton] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [output, setOutput] = useState<string>("");
  const [version, setVersion] = useState<string>("");

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
    const languageVersion = LANGUAGE_VERSIONS.find(
      (lang) => lang.language === language
    );
    if (languageVersion) {
      setVersion(languageVersion.version);
    }
  };

  const runCode = async () => {
    setIsLoading(true);
    if (editorRef.current !== null) {
      const sourceCode = editorRef.current.getValue();
      console.log(version);
      if (!sourceCode) return;
      try {
        const codeOutput = await axios.post(
          "https://emkc.org/api/v2/piston/execute",
          {
            language: language ? language : "javascript",
            version: version ? version : "18.15.0",
            files: [
              {
                content: sourceCode,
              },
            ],
          }
        );
        console.log(codeOutput.data);
        setActiveTab("output");
        setOutput(codeOutput.data.run.output);
        setActiveOutputButton(true);
        setActiveRunButton(false);
      } catch (error) {
        console.error(error);
      }
    }
    setIsLoading(false);
    setActiveTab("output");
  };

  return (
    <>
      <div className="font-Code w-full h-full">
        <div className="flex flex-row mx-4 gap-2">
          <div className="w-full">
            <div className="basis-1/2 flex justify-end w-full py-2 pr-4">
              <LanguageSelector language={language} onSelect={onSelect} />
            </div>
            <div className="rounded-lg">
              {activeTab === "code" && (
                <Editor
                  language={language}
                  defaultValue={CODE_SNIPPETS[language]}
                  height="70vh"
                  theme="vs-dark"
                  value={value}
                  onMount={onMount}
                  onChange={() => {
                    handleChange;
                  }}
                />
              )}
              {activeTab === "output" && (
                <div className="w-full h-[50vh]">
                  {/* <CodeOutput editorRef={editorRef} language={language} /> */}
                  <div className="w-full h-full border-2 text-white border-white rounded-xl pl-2 pt-2">
                    {output ? (
                      output
                    ) : (
                      <div>
                        <p className="text-slate-700">
                          Click on Run Code to see the output
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-1/2 flex flex-row ml-4">
          <div className="">
            <button
              type="button"
              className={`px-6 py-2 font-bold ${
                activeRunButton === true
                  ? "bg-white text-black"
                  : "bg-black text-white"
              }`}
              onClick={() => {
                setActiveTab("code");
                setInactivetab("output");
                setActiveRunButton(true);
                setActiveOutputButton(false);
              }}
            >
              Code
            </button>
          </div>
          <div className="">
            <button
              type="button"
              className={`px-4 py-2 font-bold ${
                activeOutputButton === true
                  ? "bg-white text-black"
                  : "bg-black text-white"
              }`}
              onClick={() => {
                setActiveTab("output");
                setInactivetab("code");
                setActiveOutputButton(true);
                setActiveRunButton(false);
              }}
            >
              Output
            </button>
          </div>
          <div className="">
            <button
              type="button"
              className="px-4 py-2 font-bold bg-black text-white disabled:cursor-not-allowed"
              disabled={activeOutputButton}
              onClick={runCode}
            >
              {isLoading ? "Running..." : "Run"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MonacoEditor;
