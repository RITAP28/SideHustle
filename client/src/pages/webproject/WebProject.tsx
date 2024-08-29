import axios from "axios";
import Terminal from "./components/Terminal";
import { useEffect, useState } from "react";
import socket from "../../utils/socket";
import { FaFileCirclePlus } from "react-icons/fa6";
import { FaFolderPlus } from "react-icons/fa6";
import { Editor } from "@monaco-editor/react";

const WebProject = () => {
  const [fileTree, setFileTree] = useState({});
  const urlParams = new URLSearchParams(window.location.search);
  const userId = Number(urlParams.get("userId"));
  const project = String(urlParams.get("project"));

  const handleFilesSideBar = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8082/filetree?project=${project}`,
        {
          data: {
            userId: userId,
            project: project,
          },
        }
      );
      console.log(res.data.files);
      setFileTree(res.data.files);
    } catch (error) {
      console.error("Error while fetching files on the sidebar: ", error);
    }
  };

  useEffect(() => {
    handleFilesSideBar();
  }, []);

  console.log(fileTree);

  useEffect(() => {
    socket.addEventListener("files:refresh", handleFilesSideBar);

    return () => {
      socket.removeEventListener("files:refresh", handleFilesSideBar);
    };
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-row bg-black">
      <div className="w-[20%] bg-slate-700">
        <div className="w-full flex flex-row bg-black text-white font-Philosopher py-2">
          <div className="w-[40%]">
          <p className="pl-1">Workspace</p>
          </div>
          <div className="w-[60%] flex flex-row gap-2 justify-end pr-[2rem] items-center">
            <div className="">
              <FaFileCirclePlus className="hover:cursor-pointer" />
            </div>
            <div className="">
              <FaFolderPlus className="hover:cursor-pointer" />
            </div>
          </div>
        </div>
        {Object.keys(fileTree).length === 0 ? (
          <p className="">Loading...</p>
        ) : (
          <div className="hover:cursor-pointer hover:bg-slate-600 transition-all ease-in-out duration-100">
            <RenderNode nodes={fileTree} />
          </div>
        )}
      </div>
      <div className="w-[80%] flex flex-col h-[100vh]">
        <div className="flex flex-row w-full h-[70vh]">
          <div className="basis-1/2 w-full">
            <div className="w-full h-full">
              <Editor
                language=""
                height="70vh"
                theme="vs-dark"
              />
            </div>
          </div>
          <div className="basis-1/2 w-full bg-red-400">Web Browser</div>
        </div>
        <div className="w-full h-[30vh] bg-slate-700 text-white">
          <Terminal />
        </div>
      </div>
    </div>
  );
};

export default WebProject;

const RenderNode = ({
  nodes,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodes: Record<string, any>;
}) => {
  return (
    <ul className="">
      {Object.entries(nodes).map(([fileName, childNode]) => (
        <li key={fileName}>
          <div
            className=""
            onClick={(e) => {
              e.stopPropagation();
              if (typeof childNode === "object" && childNode !== null){
                return;
              }
              // search the contents of the file
              
            }}
          >
            <p
              className={
                typeof childNode === "object" && childNode !== null
                  ? "text-white pl-2"
                  : "text-red-400 pl-2"
              }
            >
              {fileName}
            </p>
            {typeof childNode === "object" && childNode !== null && (
              <div className="pl-2">
                <RenderNode nodes={childNode} />
              </div>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};
