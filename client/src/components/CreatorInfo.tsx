import axios from "axios";
import { useEffect, useState } from "react";
import { FaRegStar } from "react-icons/fa";
import { BiDislike } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { RxAvatar } from "react-icons/rx";
import { useAppSelector } from "../redux/hooks/hook";

const CreatorInfo = ({
  userId,
  creatorId,
  isSubscribed,
}: {
  userId: number;
  creatorId: number;
  isSubscribed: boolean;
}) => {
  const { currentUser } = useAppSelector((state) => state.user);
  // const urlParams = new URLSearchParams(window.location.search);
  const [, setCreatorEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [creatorName, setCreatorName] = useState<string>("");
  const [subscribed, setSubscribed] = useState<boolean>(isSubscribed);
  const getCreatorInfo = async (id: number) => {
    try {
      const creator = await axios.get(
        `http://localhost:7070/getCreator?creator=${id}`,
        {
          withCredentials: true,
        }
      );
      setCreatorName(String(creator.data.creatorName));
      setCreatorEmail(creator.data.creatorEmail);
    } catch (error) {
      console.error("Error getting creator information: ", error);
    }
  };

  useEffect(() => {
    getCreatorInfo(creatorId);
  }, [creatorId]);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const subscriber = await axios.post(
        `http://localhost:7070/subscribe?creator=${creatorId}&user=${userId}`,
        null,
        {
          withCredentials: true,
        }
      );
      console.log(subscriber.data);
      setLoading(false);
      setSubscribed(true);
    } catch (error) {
      console.error("Error subscribing to creator: ", error);
    }
  };

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
            {creatorName !== currentUser?.name && (
              <button
                type="button"
                className={`px-4 py-2 font-bold font-Code ${
                  subscribed ? "bg-black text-white" : "bg-white text-black"
                }`}
                onClick={() => {
                  if(!subscribed){
                    handleSubscribe();
                  }
                }}
                disabled={loading || subscribed}
              >
                {subscribed ? "Subscribed" : "Subscribe"}
              </button>
            )}
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
