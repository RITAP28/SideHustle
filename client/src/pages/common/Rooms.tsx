import Sidebar from "../../components/Sidebar";

const Rooms = () => {
  return (
    <div className="pt-[5rem] w-full flex flex-row min-h-screen bg-black">
      <div className="basis-1/6">
        <Sidebar />
      </div>
      <div className="basis-5/6 flex justify-center">
        <div className="flex flex-col font-Code font-bold">
          <div className="">
            <button type="button" className="w-[10rem] py-2 bg-black text-white border-2 border-white hover:bg-white hover:text-black">
              Create a Room
            </button>
          </div>
          <div className="pt-4">
            <button type="button" className="w-[10rem] py-2 bg-black text-white border-2 border-white hover:bg-white hover:text-black">
              Join a Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
