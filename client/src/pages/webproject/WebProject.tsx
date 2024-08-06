import Terminal from "./components/Terminal";

const WebProject = () => {
  return (
    <div className="w-full min-h-screen flex flex-row bg-black">
      <div className="w-[20%] bg-slate-700">Files</div>
      <div className="w-[80%] flex flex-col">
        <div className="flex flex-row w-full">
          <div className="basis-1/2 w-full bg-red-800 h-[70vh]">Code Editor</div>
          <div className="basis-1/2 w-full bg-red-400 h-[70vh]">Web Browser</div>
        </div>
        <div className="w-full h-[30vh] bg-slate-700 text-white">
          <Terminal />
        </div>
      </div>
    </div>
  );
};

export default WebProject;
