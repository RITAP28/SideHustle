import axios from "axios";
import { useEffect, useState } from "react";
import { FaRegStar } from "react-icons/fa";
import { BiDislike } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { RxAvatar } from "react-icons/rx";

const CreatorInfo = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const [, setCreatorEmail] = useState<string>("");
  const [creatorName, setCreatorName] = useState<string>("");
  const creatorId = urlParams.get("creator") as string;
  const getCreatorInfo = async (id: string) => {
    try {
      const creator = await axios.get(
        `http://localhost:7070/getCreator?creator=${id}`,
        {
          withCredentials: true,
        }
      );
      console.log(creator.data);
      console.log(creator.data.creatorName);
      setCreatorName(String(creator.data.creatorName));
      setCreatorEmail(creator.data.creatorEmail);
    } catch (error) {
      console.error("Error getting creator information: ", error);
    }
  };

  useEffect(() => {
    getCreatorInfo(creatorId);
  }, [creatorId]);
  return (
    <>
      <div className="w-full flex flex-row">
        <div className="w-1/2 flex flex-row">
          <div className="w-[20%] flex justify-center">
            <RxAvatar className="text-[3rem]" />
          </div>
          <div className="w-[40%]">
            <p className="font-Philosopher text-xl">{creatorName}</p>
            <p className="">10 subscribers</p>
          </div>
          <div className="w-[40%] flex items-center pl-2">
            <button
              type="button"
              className="px-4 py-2 bg-white text-black font-bold font-Code"
            >
              Subscribe
            </button>
          </div>
        </div>
        <div className="w-1/2 flex justify-end">
          <div className="flex flex-row p-2">
            <div className="flex flex-row bg-slate-700 rounded-l-full rounded-r-full">
              <div className="w-1/2 pl-3 border-r-[1px] border-slate-600">
                <button type="button" className="p-3 text-white text-[1.4rem]">
                  <FaRegStar className="text-[1.4rem]" />
                </button>
              </div>
              <div className="w-1/2 pr-3">
                <button type="button" className="p-3 text-white text-[1.4rem]">
                  <BiDislike className="text-[1.4rem]" />
                </button>
              </div>
            </div>
            <div className="ml-2 flex items-center">
              <button
                type="button"
                className="p-3 rounded-full bg-slate-700 text-white hover:bg-slate-500"
              >
                <BsThreeDots className="text-[1.4rem] text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatorInfo;
