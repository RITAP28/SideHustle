import Sidebar from "../../components/Sidebar"

const Community = () => {
  return (
    <div className="pt-[5rem] w-full bg-black min-h-screen flex flex-row">
        <div className="basis-1/6">
            <Sidebar />
        </div>
        <div className="basis-5/6">
            <p className="text-white font-Code font-bold">
                Community
            </p>
        </div>
    </div>
  )
}

export default Community