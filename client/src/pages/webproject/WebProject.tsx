import axios from "axios";
import { Editor } from "@monaco-editor/react";
import Terminal from "./components/Terminal";
import { useEffect, useState } from "react";
import socket from "../../utils/socket";
import { FaFileCirclePlus } from "react-icons/fa6";
import { FaFolderPlus } from "react-icons/fa6";
// import { FaReact } from "react-icons/fa";
// import { SiTypescript } from "react-icons/si";
// import { IoLogoJavascript } from "react-icons/io5";

// export const FILE_ICONS = {
//   '.jsx': <FaReact />,
//   '.tsx': <FaReact />,
//   '.js': 
// }

const WebProject = () => {
  const [fileTree, setFileTree] = useState({});

  const urlParams = new URLSearchParams(window.location.search);
  const projectName = urlParams.get("project");

  const handleFilesSideBar = async () => {
    try {
      const res = await axios.get("http://localhost:8082/filetree", {
        params: {
          project: projectName,
        },
      });
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
    <>
      <div className="w-full h-[5vh] flex flex-row bg-black">
        <div className="w-[12%] flex items-center pl-2">
          <button
            type="button"
            className="bg-white px-2 py-0.5 border-2 border-white font-Philosopher font-bold text-black hover:bg-black hover:text-white transition ease-in-out duration-150"
          >
            NexusEditor Beta
          </button>
        </div>
        <div className="w-[12%] flex items-center">
          <button
            type="button"
            className="bg-slate-500 px-2 py-0.5 font-Philosopher font-bold text-white hover:bg-slate-700 transition ease-in-out duration-150 rounded-xl"
          >
            Beta Feedback
          </button>
        </div>
      </div>
      <div className="w-full h-[95vh] flex flex-row bg-black">
        <div className="w-[20%] bg-slate-700">
          <div className="w-full flex flex-row bg-black">
            <div className="w-[50%] font-Philosopher text-sm text-white pl-4">
              your Workspace...
            </div>
            <div className="w-[50%] flex justify-end pr-4">
              <div className="flex flex-row gap-2">
                <div className="">
                  <FaFileCirclePlus className="text-white hover:cursor-pointer" />
                </div>
                <div className="">
                  <FaFolderPlus className="text-white hover:cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
          {Object.keys(fileTree).length === 0 ? (
            <p className="">Loading...</p>
          ) : (
            <RenderNode nodes={fileTree} />
          )}
        </div>
        <div className="w-[80%] flex flex-col h-[100%]">
          <div className="flex flex-row w-full h-[62vh]">
            <div className="basis-1/2 w-full bg-slate-800">
              <Editor className="w-full h-full" theme="vs-dark" />
            </div>
            <div className="basis-1/2 w-full bg-red-400">Web Browser</div>
          </div>
          <div className="w-full h-[33vh] bg-slate-700 text-white">
            <Terminal />
          </div>
        </div>
      </div>
    </>
  );
};

export default WebProject;

const RenderNode = ({
  nodes,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodes: Record<string, any>;
}) => {
  // const handleFet
  return (
    <ul className="">
      {Object.entries(nodes).map(([fileName, childNode]) => (
        <li key={fileName}>
          <div
            className="hover:bg-slate-600"
            onClick={(e) => {
              e.stopPropagation();
              if (typeof childNode === "object" && childNode !== null) return;

            }}
          >
            <p
              className={
                typeof childNode === "object" && childNode !== null
                  ? "text-white pl-2 font-Code hover:cursor-pointer"
                  : "text-red-400 pl-2 font-Code hover:cursor-pointer"
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
