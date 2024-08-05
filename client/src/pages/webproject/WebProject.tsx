
const WebProject = () => {
  return (
    <div className="w-full min-h-screen flex flex-row bg-black">
        <div className="w-[20%] bg-slate-700">
            Files
        </div>
        <div className="w-[40%] bg-slate-500">
            Code Editor
        </div>
        <div className="w-[40%] flex flex-col">
            <div className="w-full h-[70vh] bg-red-200 text-red-400">
                <p className="">Web Browser</p>
            </div>
            <div className="w-full h-[30vh] bg-slate-700 text-white">
                Terminal
            </div>
        </div>
    </div>
  )
}

export default WebProject