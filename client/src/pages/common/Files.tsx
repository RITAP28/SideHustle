import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LANGUAGE_VERSIONS } from "../../utils/constants";
import { FaGithub, FaPlus } from "react-icons/fa";
import { MdHomeFilled } from "react-icons/md";
import { FaFolder } from "react-icons/fa";
import { TfiWorld } from "react-icons/tfi";
import { RiGitRepositoryPrivateFill } from "react-icons/ri";
import { LuDot } from "react-icons/lu";
import { formatDistanceToNow } from 'date-fns';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { SiTypescript } from "react-icons/si";
import { IoLogoJavascript } from "react-icons/io5";
import { FaJava } from "react-icons/fa";
import { SiPhp } from "react-icons/si";
import { FaPython } from "react-icons/fa";
import { useToast } from "@chakra-ui/react";
import { IoMdMore } from "react-icons/io";
import { useAppSelector } from "../../redux/hooks/hook";

interface filesProps {
  filename: string;
  template: string;
  version: string;
  content: string;
  userId: number;
  username: string;
  updatedAt: Date;
}

const languages = LANGUAGE_VERSIONS;
// const defaultCode = CODE_SNIPPETS;

const Files = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const { currentUser } = useAppSelector((state) => state.user);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [allFiles, setAllFiles] = useState<filesProps[]>([]);
  const [filesLoading, setFilesLoading] = useState<boolean>(false);
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [template, setTemplate] = useState<string>("");
  const [version, setVersion] = useState<string>("");
  const [, setTempSelected] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [extension, setExtension] = useState<string>(".ext");
  const [loading, setLoading] = useState<boolean>(false);
  const [shortEmail, setShortEmail] = useState<string>("");
  // const [timeAgo, setTimeAgo] = useState<string | null>(null);

  const urlParams = new URLSearchParams(window.location.search);
  const userId = Number(urlParams.get("userId"));

  const shortenedEmail = (email: string) => {
    setShortEmail(email.split("@")[0]);
  };

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
      if(currentUser){
        shortenedEmail(currentUser.email);
      }
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
        isClosable: true,
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

  const sortedFiles = allFiles.sort();
  console.log(sortedFiles);

  // const handleSortFiles = (files: filesProps[]) => {

  // }

  return (
    <>
      <div className="w-full min-h-screen bg-black flex">
        <div className="w-full flex bg-black pt-[5rem]">
          {/* left column */}
          <div className="w-[15%] bg-black">
            <div className="w-full">
              <div className="w-full px-2 pt-2">
                <button
                  type="button"
                  className="py-1 border-2 border-white w-full flex justify-center font-Philosopher text-white hover:bg-white hover:text-black rounded-md"
                  onClick={onOpen}
                >
                  <span className="flex items-center gap-1">
                    <FaPlus />
                    Create Repl
                  </span>
                </button>
              </div>
              <div className="w-full px-2 pt-2">
                <button
                  type="button"
                  className="py-1 border-2 border-white w-full flex justify-center font-Philosopher text-white hover:bg-white hover:text-black rounded-md"
                >
                  <span className="flex items-center gap-1">
                    <FaGithub />
                    Import from Github
                  </span>
                </button>
              </div>
            </div>
            <div className="py-4 flex justify-center">
              <hr className="border-slate-400 w-[90%]" />
            </div>
            <div className="w-full">
              <div className="w-full px-2 pt-2">
                <button
                  type="button"
                  className="py-1 border-2 border-white w-full flex justify-center font-Philosopher text-white hover:bg-white hover:text-black rounded-md"
                >
                  <span className="flex items-center gap-1">
                    <MdHomeFilled />
                    Home
                  </span>
                </button>
              </div>
              <div className="w-full px-2 pt-2">
                <button
                  type="button"
                  className="py-1 border-2 border-white w-full flex justify-center font-Philosopher text-white hover:bg-white hover:text-black rounded-md"
                >
                  <span className="flex items-center gap-1">
                    <FaFolder />
                    Repls
                  </span>
                </button>
              </div>
            </div>
          </div>
          {/* right column */}
          <div className="w-[85%] bg-black">
            <div className="w-full pl-[3rem] pt-[1rem] text-white font-Code font-bold text-[2rem]">
              Nexus-Editor
            </div>
            <div className="w-[40%] ml-10 pt-2 flex justify-evenly gap-2">
              <button
                type="button"
                className="py-1 border-2 border-white w-full flex justify-center font-Philosopher text-white hover:bg-blue-600 rounded-md ml-2 bg-blue-700"
                onClick={onOpen}
              >
                <span className="flex items-center gap-1">
                  <FaPlus />
                  Create Repl
                </span>
              </button>
              <button
                type="button"
                className="py-1 border-2 border-white w-full flex justify-center font-Philosopher text-white hover:bg-red-500 rounded-md bg-red-600"
              >
                <span className="flex items-center gap-1">
                  <FaFolder />
                  All Repls
                </span>
              </button>
            </div>
            <div className="pl-[3rem] pt-4 text-white font-Code font-bold">
              Recent Repls
            </div>
            <div className="pl-[3rem] w-[40%]">
              {filesLoading ? (
                <>
                  <p className="text-white font-Code text-xl font-bold">
                    Loading all your files...
                  </p>
                </>
              ) : (
                allFiles
                  .map((file, index) => (
                    <div
                      className="w-[90%] font-Code hover:bg-slate-700 text-white hover:cursor-pointer border-2 border-slate-700 px-2 py-2 my-1"
                      key={index}
                      onClick={() => {
                        navigate(
                          `/editor?userId=${userId}&filename=${file.filename}`
                        );
                      }}
                    >
                      <div className="flex">
                        <div className="w-[10%] flex items-center">
                          {handleLanguageLogo(file.template)}
                        </div>
                        <div className="flex flex-col w-[80%]">
                        <div className="pl-2 flex items-center w-full">
                          {file.filename}
                        </div>
                        <div className="pl-2 text-sm font-Philosopher font-bold text-slate-500 w-full">
                          <span className="flex items-center">
                          @{shortEmail}<LuDot />{formatDistanceToNow(new Date(file.updatedAt), {addSuffix: true})}
                          </span>
                        </div>
                        </div>
                        <div className="w-[10%] flex items-center justify-end">
                          <button
                            type="button"
                            className="hover:bg-slate-600 p-1 rounded-md"
                            onClick={() => {
                              console.log("hwllo");
                            }}
                          >
                            <IoMdMore className="text-2xl" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                  .reverse()
              )}
            </div>
          </div>
        </div>
      </div>
      {/* modal for creating a new file */}
      <div className="flex items-center">
        <Modal isOpen={isOpen} onClose={onClose} isCentered size={"xl"}>
          <ModalOverlay />
          <ModalContent>
            <div className="bg-slate-800">
              <div className="pt-2 pl-4">
                <h2 className="font-Code text-white font-bold text-lg">Create Repl</h2>
              </div>
              <ModalCloseButton className="text-white" />
              <ModalBody>
                <div className="w-full flex flex-row">
                  <div className="basis-1/2 w-full">
                    <p className="font-Code text-white">Template</p>
                    <div className="pt-2 w-full relative">
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
                      {menuOpen && (
                        <>
                          <div className="w-[95%] z-20 absolute top-full left-0 mt-1 rounded-md border-1">
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
                  <div className="basis-1/2 w-full">
                    <p className="font-Code text-white">Title</p>
                    <div className="flex flex-row w-full pt-2">
                      <div className="w-[85%]">
                        <input
                          type="text"
                          className="w-[100%] px-2 py-1 bg-black border-2 text-white border-slate-600 font-bold font-Code text-sm"
                          placeholder="enter name"
                          disabled={!template}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setFileName(e.target.value);
                          }}
                        />
                      </div>
                      <div className="w-[15%]">
                        <p className="font-Code font-bold pl-1 flex text-white items-end">
                          {loading ? "..." : extension}
                        </p>
                      </div>
                    </div>
                    <div className="w-full pt-2">
                      <p className="font-Philosopher text-white">
                        <span className="flex items-center gap-2">
                          <TfiWorld />
                          Public
                        </span>
                      </p>
                    </div>
                    <div className="w-full pt-2">
                      <p className="text-sm text-slate-500 font-Philosopher">
                        Your friends can view and fork this repl
                      </p>
                    </div>
                    <div className="w-full flex justify-center pt-2">
                      <button
                        type="button"
                        className="px-4 py-1 border-2 border-white rounded-md hover:bg-white hover:text-black text-white text-sm font-Philosopher"
                      >
                        <span className="flex items-center gap-2">
                          <RiGitRepositoryPrivateFill />
                          Upgrade to make private
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </ModalBody>

              <div className="w-full flex justify-center pb-4 pt-20">
                <button
                  onClick={() => {
                    if(!fileName){
                      return new Error('Please enter a fileName');
                    }
                    handleCreateNewFile();
                  }}
                  className="text-white px-4 py-1 border-white border-2 font-Code rounded-md hover:bg-white hover:text-black"
                  disabled={!fileName}
                >
                  {fileLoading ? "Getting done..." : "Create"}
                </button>
              </div>
            </div>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default Files;
