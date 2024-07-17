import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    Modal,
    useDisclosure,
  } from "@chakra-ui/react";
import { LANGUAGE_VERSIONS } from "../../utils/constants";

interface filesProps {
  filename: string;
  template: string;
  version: string;
  content: string;
  userId: number;
  username: string;
}

const languages = LANGUAGE_VERSIONS;

const Files = () => {
  const navigate = useNavigate();
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
    } catch (error) {
      console.error("Error while creating a new file: ", error);
    }
    setFileLoading(false);
    navigate(`/editor?userId=${userId}&filename=${fullName}`);
    onClose();
  };

  return (
    <>
    <div className="">
        <Modal
          blockScrollOnMount={false}
          isOpen={isOpen}
          onClose={onClose}
          isCentered
          size={"xl"}
        >
          <ModalOverlay />
          <ModalContent backgroundColor={"gray"}>
            <h1 className="font-Code font-bold text-lg pl-2 pt-2">
              Create a new file:
            </h1>
            <ModalCloseButton />
            <ModalBody>
              <div className="w-full flex flex-row">
                <div className="basis-1/2 w-full">
                  <div className="w-full">
                    <p className="font-Philosopher font-semibold underline">
                      Templates:
                    </p>
                  </div>
                  <div className="pt-2">
                    <input
                      type="search"
                      name=""
                      className={`w-[95%] px-2 py-1 bg-slate-800 border-2 border-black font-Code text-sm text-white`}
                      placeholder="Search Templates"
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
                  </div>
                  <div className="w-[95%]">
                    {menuOpen && (
                      <>
                        <div className="z-10 relative">
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
                  <div className="w-full">
                    <p className="font-Philosopher font-semibold underline">
                      Name:
                    </p>
                  </div>
                  <div className="w-full pt-2 flex">
                    <input
                      type="text"
                      name=""
                      className="w-[90%] px-2 py-1 text-sm border-2 border-black bg-slate-800 font-Code text-white"
                      placeholder="Name your file"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFileName(e.target.value);
                      }}
                    />
                    <p className="font-Code font-bold pl-1 flex items-end">
                      {loading ? "..." : extension}
                    </p>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex justify-center w-full">
                <button
                  type="button"
                  className="font-Code font-bold text-white bg-black border-2 border-white px-2 py-1 hover:bg-white hover:text-black"
                  onClick={() => {
                    console.log("Template is: ", template);
                    console.log("Name is: ", fileName);
                    handleCreateNewFile();
                  }}
                  disabled={fileLoading}
                >
                  {fileLoading ? "Creating file..." : "Create File"}
                </button>
              </div>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
      <div className="bg-black w-full min-h-screen">
        {filesLoading ? (
          "loading..."
        ) : (
          <div className="w-full min-h-screen pt-[5rem] bg-black">
            <div className="font-Code text-white">All your files</div>
            <div className="">
              {allFiles.map((file, index) => (
                <div
                  className="hover:cursor-pointer hover:bg-slate-600"
                  key={index}
                  onClick={() => {
                    navigate(
                      `/editor?userId=${userId}&filename=${file.filename}`
                    );
                  }}
                >
                  <div className="text-white">{file.filename}</div>
                </div>
              ))}
            </div>
            <div className="">
              <button
                type="button"
                className="font-Code font-bold text-white bg-black border-2 border-white px-2 py-1 hover:bg-white hover:text-black"
                onClick={onOpen}
              >
                Create New File
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Files;
