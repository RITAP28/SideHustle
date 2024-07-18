import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LANGUAGE_VERSIONS } from "../../utils/constants";

interface filesProps {
  filename: string;
  template: string;
  version: string;
  content: string;
  userId: number;
  username: string;
}
import { SiTypescript } from "react-icons/si";
import { IoLogoJavascript } from "react-icons/io5";
import { FaJava } from "react-icons/fa";
import { SiPhp } from "react-icons/si";
import { FaPython } from "react-icons/fa";
import { useToast } from "@chakra-ui/react";

const languages = LANGUAGE_VERSIONS;
// const defaultCode = CODE_SNIPPETS;

const Files = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [allFiles, setAllFiles] = useState<filesProps[]>([]);
  const [, setFilesLoading] = useState<boolean>(false);
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [template, setTemplate] = useState<string>("");
  const [version, setVersion] = useState<string>("");
  const [, setTempSelected] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [extension, setExtension] = useState<string>(".ext");
  const [loading, setLoading] = useState<boolean>(false);

  const urlParams = new URLSearchParams(window.location.search);
  const userId = Number(urlParams.get("userId"));

  function handleSelectExtension(template: string) {
    setLoading(true);
    if (template === "javascript") {
      setExtension(".js");
    } else if (template === "typescript") {
      setExtension(".ts");
    } else if (template === "python") {
      setExtension(".py");
    } else if (template === "java") {
      setExtension(".java");
    } else if (template === "php") {
      setExtension(".php");
    }
    setLoading(false);
  }

  const handleGetAllFiles = useCallback(async () => {
    setFilesLoading(true);
    try {
      const files = await axios.get(
        `http://localhost:7070/getallfiles?userId=${userId}`,
        {
          withCredentials: true,
        }
      );
      console.log(files.data);
      setAllFiles(files.data.files);
    } catch (error) {
      console.error("Error while fetching all files: ", error);
    }
    setFilesLoading(false);
  }, [userId]);

  useEffect(() => {
    handleGetAllFiles();
  }, [handleGetAllFiles]);

  const handleCreateNewFile = async () => {
    setFileLoading(true);
    const fullName: string = fileName + extension;
    console.log(fullName);
    try {
      const file = await axios.post(
        `http://localhost:7070/createnewfile?userId=${userId}`,
        {
          template,
          version,
          
          fullName,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(file.data);
      toast({
        title: "File created successfully",
        status: "success",
        duration: 4000,
        isClosable: true
      });
      navigate(`/editor?userId=${userId}&filename=${fullName}`);
    } catch (error) {
      console.error("Error while creating a new file: ", error);
    }
    setFileLoading(false);
  };

  const handleLanguageLogo = (template: string) => {
    if (template === "javascript") {
      return <IoLogoJavascript className="text-[2rem] text-yellow-400" />;
    } else if (template === "typescript") {
      return <SiTypescript className="text-[1.8rem] text-blue-500" />;
    } else if (template === "php") {
      return <SiPhp className="text-[2rem]" />;
    } else if (template === "java") {
      return <FaJava className="text-[2rem]" />;
    } else if (template === "python") {
      return <FaPython className="text-[2rem]" />;
    }
  };

  return (
    <>
      <div className="w-full min-h-screen flex justify-center items-center bg-black pt-[5rem]">
        <div className="w-[70%] h-[15rem] flex flex-row overflow-hidden">
          <div className="basis-1/2 border-r-2 border-slate-600 overflow-y-auto">
            <div className="w-full flex justify-center">
              <p className="font-Code text-white font-bold sticky top-0">open any file:</p>
            </div>
            <div className="flex justify-center pt-2">
              <div className="w-full">
                {allFiles.map((file, index) => (
                  <div
                    className="w-[90%] font-Code hover:bg-slate-700 text-white hover:cursor-pointer border-2 border-slate-700 px-2 py-2 my-1"
                    key={index}
                    onClick={() => {
                      navigate(
                        `/editor?userId=${userId}&filename=${file.filename}`
                      );
                    }}
                  >
                    <div className="flex flex-row">
                      <div className="basis-1/2 flex justify-start pl-2 items-center">
                        {file.filename}
                      </div>
                      <div className="basis-1/2 flex justify-end pr-2">
                        {handleLanguageLogo(file.template)}
                      </div>
                    </div>
                  </div>
                )).reverse()}
              </div>
            </div>
          </div>
          <div className="basis-1/2 w-full">
            <div className="w-full flex justify-center pt-2 font-Code text-white font-bold">
              Create a new file
            </div>
            <div className="flex justify-center items-center">
              <div className="w-[95%] flex flex-row pt-2">
                <div className="basis-1/2 w-full relative">
                  {/* <p className="font-Code text-white">Template</p> */}
                  <input
                    type="search"
                    className="w-[95%] px-2 py-1 bg-black border-2 font-bold text-white border-slate-600 font-Code text-sm"
                    placeholder="choose language"
                    onClick={() => {
                      setMenuOpen(true);
                    }}
                    readOnly
                    autoFocus
                    onBlur={() => {
                      setMenuOpen(false);
                    }}
                    value={template}
                  />
                  <div className="">
                    {menuOpen && (
                      <>
                        <div className="w-[95%] z-20 absolute top-full left-0 mt-1">
                          {languages.map((lang, index) => (
                            <>
                              <div
                                className="flex flex-row w-full bg-slate-700 text-white py-1 hover:cursor-pointer hover:bg-black hover:text-white"
                                key={index}
                                onMouseDown={() => {
                                  setTemplate(lang.language);
                                  setVersion(lang.version);
                                  setTempSelected(true);
                                  console.log(lang.language);
                                  handleSelectExtension(lang.language);
                                }}
                                onMouseUp={() => {
                                  setMenuOpen(false);
                                  setTempSelected(false);
                                  console.log("Nothing selected!");
                                }}
                              >
                                <div className="basis-1/2 flex justify-center">
                                  {lang.language}
                                </div>
                                <div className="basis-1/2 flex justify-center">
                                  {lang.version}
                                </div>
                              </div>
                              <hr className="border-slate-600" />
                            </>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="basis-1/2 w-full flex">
                  {/* <p className="font-Code text-white">Name</p> */}
                  <input
                    type="text"
                    className="w-[90%] px-2 py-1 bg-black border-2 text-white border-slate-600 font-Code text-sm"
                    placeholder="enter name"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFileName(e.target.value);
                    }}
                  />
                  <p className="font-Code font-bold pl-1 flex text-white items-end">
                    {loading ? "..." : extension}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-center pt-4">
              <button type="button" className="px-4 py-2 bg-black font-Code text-white font-bold hover:bg-white hover:text-black border-2 border-white" onClick={() => {
                handleCreateNewFile();
              }}>
                {fileLoading ? "creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Files;
