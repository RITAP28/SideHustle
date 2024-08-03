import React from "react";
import { FaJava, FaPython } from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io5";
import { MdHomeFilled } from "react-icons/md";
import { SiPhp, SiTypescript } from "react-icons/si";

const Editortopbar = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const fileName = urlParams.get('filename')?.split('.')[0];
  const extension = urlParams.get('filename')?.split('.')[1] as string;

  function handleExtensionLogo(extension: string){
    if(extension === 'js'){
      return <IoLogoJavascript className="text-[1rem] text-yellow-400" />
    } else if(extension === 'ts'){
      return <SiTypescript />
    } else if(extension === 'php'){
      return <SiPhp />
    } else if(extension === 'java'){
      return <FaJava />
    } else {
      return <FaPython />
    }
  }

  return (
    <div className="flex flex-row py-4">
      <div className="px-2 text-white">
        <button type="button" className="border-2 border-slate-500 hover:bg-slate-500 hover:text-white font-Philosopher px-2 rounded-sm">
          <span className="flex flex-row items-center gap-2">
            <MdHomeFilled />
            Home
          </span>
        </button>
      </div>
      <div className="px-2">
        <button type="button" className="border-2 border-slate-500 hover:bg-slate-500 text-white font-bold hover:text-white font-Philosopher px-4 rounded-sm">
          <span className="flex flex-row items-center gap-2">
            {handleExtensionLogo(extension)}
            {fileName}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Editortopbar;
