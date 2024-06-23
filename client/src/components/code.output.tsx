import axios from "axios";
import * as monaco from "monaco-editor";
import { LANGUAGE_VERSIONS } from "../utils/constants";
import { useState } from "react";

const CodeOutput = ({
  editorRef,
  language,
}: {
  editorRef: React.RefObject<monaco.editor.IStandaloneCodeEditor>;
  language: string;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const  [output, setOutput] = useState<string>("");
  const [version, setVersion] = useState<string>("");

  const versionFinder = (language: string) => {
    const languages = LANGUAGE_VERSIONS;
    for(let i=0; i<languages.length; i++){
      if(language == String(languages[i])){
        setVersion(languages[i].version);
      }
    }
  };

  const runCode = async () => {
    setIsLoading(true);
    versionFinder(language);
    if (editorRef.current !== null) {
      const sourceCode = editorRef.current.getValue();
      if (!sourceCode) return;
      try {
        const codeOutput = await axios.post(
          "https://emkc.org/api/v2/piston/execute",
          {
            language: language,
            version: version,
            files: [
              {
                content: sourceCode,
              },
            ],
          }
        );
        console.log(codeOutput.data);
        setOutput(codeOutput.data.run.output);
      } catch (error) {
        console.error(error);
      }
    }
    setIsLoading(false);
  };
  return (
    <>
      <div className="basis-1/2 w-full justify-start ml-[1rem] mb-6 hidden">
        <button
          type="button"
          className="px-4 py-2 text-black bg-white font-bold rounded-lg"
          onClick={runCode}
        >
          {isLoading ? "Running code..." : "Run Code"}
        </button>
      </div>
      <div className="w-full h-full border-2 border-white rounded-xl pl-2 pt-2">
        {output ? output : (
          <div>
            <p className="text-slate-700">
              Click on Run Code to see the output
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CodeOutput;
