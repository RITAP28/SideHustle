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
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const languages = LANGUAGE_VERSIONS;

interface fileProps {
    filename: string;
    template: string;
    content: string;
    userId: number;
    username: string
}

const AllFiles = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [template, setTemplate] = useState<string>("");
  const [, setTempSelected] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const [extension, setExtension] = useState<string>(".ext");
  const [loading, setLoading] = useState<boolean>(false);
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [retrieving, setRetrieving] = useState<boolean>(false);
  const [allFiles, setAllFiles] = useState<fileProps[]>([]);

  const urlParams = new URLSearchParams(window.location.search);
  const userId = Number(urlParams.get("userId"));

  function handleSelectExtension(template: string) {
    setLoading(true);
    if(template === "javascript"){
        setExtension(".js");
    } else if(template === "typescript"){
        setExtension(".ts");
    } else if(template === "python"){
        setExtension(".py");
    } else if(template === "java"){
        setExtension(".java");
    } else if(template === "php"){
        setExtension(".php");
    }
    setLoading(false);
  }

  const handleCreateNewFile = async () => {
    setFileLoading(true);
    const fullName: string = fileName + extension;
    console.log(fullName);
    try {
        const file = await axios.post(`http://localhost:7070/createnewfile?userId=${userId}`, {
            template,
            fullName
        }, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log(file.data);
    } catch (error) {
        console.error("Error while creating a new file: ", error);
    }
    setFileLoading(false);
    onClose();
  };

  const handleRetrieveFiles = useCallback(async () => {
    setRetrieving(true);
    try {
        const files = await axios.get(`http://localhost:7070/getallfiles?userId=${userId}`, {
            withCredentials: true
        });
        console.log(files.data);
        setAllFiles(files.data.files);
    } catch (error) {
        console.error("Error while retrieving files: ", error);
    }
    setRetrieving(false);
  }, [userId]);

  useEffect(() => {
    handleRetrieveFiles();
  }, [handleRetrieveFiles]);

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
      <div className="flex justify-center pb-4">
        <button
          type="button"
          className="px-4 py-1 border-2 border-white text-white font-Code hover:bg-white hover:text-black"
          onClick={onOpen}
        >
          New File
        </button>
      </div>
      <hr className="border-slate-700" />
      <div className="flex justify-center text-white font-Code pt-4">
        {retrieving ? "getting your files..." : (
            allFiles.length > 0 ? (
                <div>
                    {allFiles.map((file, index) => (
                        <div className="" key={index}>
                            <div className="">
                                {file.filename}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    No files found
                </div>
            )
        )}
      </div>
    </>
  );
};

export default AllFiles;
