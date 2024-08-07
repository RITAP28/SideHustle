import axios from "axios";
import FilesSidebar from "./components/FilesSidebar";
import Terminal from "./components/Terminal";
import { useEffect, useState } from "react";

const WebProject = () => {
  const [fileTree, setFileTree] = useState({});
  useEffect(() => {
    const handleFilesSideBar = async () => {
      try {
        const res = await axios.get('http://localhost:8082/filetree');
        console.log(res.data.files);
        setFileTree(res.data.files);
      } catch (error) {
        console.error("Error while fetching files on the sidebar: ", error);
      }
    };

    handleFilesSideBar();
  }, []);
  return (
    <div className="w-full min-h-screen flex flex-row bg-black">
      <div className="w-[20%] bg-slate-700">
        <FilesSidebar fileTree={fileTree} onSelect={} />
      </div>
      <div className="w-[80%] flex flex-col h-[100vh]">
        <div className="flex flex-row w-full h-[70vh]">
          <div className="basis-1/2 w-full bg-red-800">Code Editor</div>
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
