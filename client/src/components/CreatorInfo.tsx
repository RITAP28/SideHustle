import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { FaRegStar } from "react-icons/fa";
import { BiDislike } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { RxAvatar } from "react-icons/rx";
import { useAppSelector } from "../redux/hooks/hook";
import { FaNoteSticky } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";
import { useToast } from "@chakra-ui/react";
import { BiSolidDislike } from "react-icons/bi";

const CreatorInfo = ({
  userId,
  creatorId,
  isSubscribed,
  videoId,
}: {
  userId: number;
  creatorId: number;
  isSubscribed: boolean;
  videoId: number;
}) => {
  const toast = useToast();
  const { currentUser } = useAppSelector((state) => state.user);
  // const urlParams = new URLSearchParams(window.location.search);
  const [, setCreatorEmail] = useState<string>("");
  const [, setLoading] = useState<boolean>(false);
  const [creatorName, setCreatorName] = useState<string>("");
  const [subscribed, setSubscribed] = useState<boolean>(isSubscribed);
  const [, setUnsubscribeLoading] = useState<boolean>(false);
  const [totalSubscribers, setTotalSubscribers] = useState([]);
  const [isStarred, setIsStarred] = useState<boolean>(false);
  const [, setAllStars] = useState([]);
  const [dislike, setDislike] = useState<boolean | null>(null);

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

  const handleUnsubscribe = async () => {
    setUnsubscribeLoading(true);
    try {
      const res = await axios.delete(`http://localhost:7070/unsubscribe?user=${userId}&creator=${creatorId}`, {
        withCredentials: true
      });
      console.log(res.data);
      setSubscribed(false);
    } catch (error) {
      console.error("Error unsubscribing from creator: ", error);
    }
    setUnsubscribeLoading(false);
  }

  const handleStarVideo = async () => {
    try {
      await axios.post(
        `http://localhost:7070/starAVideo?user=${userId}&creator=${creatorId}&videoId=${videoId}`,
        null,
        {
          withCredentials: true,
        }
      );
      console.log("Starred sir/ma'am...");
      setIsStarred(true);
    } catch (error) {
      console.error("Error while starring a video: ", error);
    }
  };

  const handleIsStarred = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:7070/isStarred?user=${userId}&videoId=${videoId}`,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      console.log("STarred already");
      setIsStarred(res.data.isStar);
    } catch (error) {
      console.error("Error while checking if starred: ", error);
    }
  }, [userId, videoId]);

  useEffect(() => {
    handleIsStarred();
  }, [handleIsStarred]);

  const handleGetAllStars = useCallback(async () => {
    try {
      const allStars = await axios.get(
        `http://localhost:7070/getAllStars?videoId=${videoId}`,
        {
          withCredentials: true,
        }
      );
      console.log(allStars.data);
      setAllStars(allStars.data.starsbyVideoId);
    } catch (error) {
      console.error("Error while fetching all stars: ", error);
    }
  }, [videoId]);

  useEffect(() => {
    handleGetAllStars();
  }, [handleGetAllStars]);

  const handleGetAllSubscribers = useCallback(async () => {
    try {
      const subscribers = await axios.get(`http://localhost:7070/getAllSubscribers?creator=${creatorId}`, {
        withCredentials: true
      });
      console.log("Subscribers are: ", subscribers);
      setTotalSubscribers(subscribers.data.subscribers);
    } catch (error) {
      console.error("Error getting all subscribers: ", error);
    }
  }, [creatorId]);

  useEffect(() => {
    handleGetAllSubscribers();
  }, [handleGetAllSubscribers]);

  const handleCheckDislike = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:7070/isDisliked?user=${userId}&videoId=${videoId}`, {
        withCredentials: true
      });
      console.log(res.data);
      setDislike(res.data.disliked);
    } catch (error) {
      console.error("Error while checking isDisliked: ", error);
    }
  }, [userId, videoId]);

  useEffect(() => {
    handleCheckDislike();
  }, [handleCheckDislike]);

  const handleDislikeVideo = async () => {
    try {
      const res = await axios.post(`http://localhost:7070/dislike?user=${userId}&videoId=${videoId}&creator=${creatorId}`, null, {
        withCredentials: true
      });
      console.log("Disliked video: ", res.data);
      setDislike(true);
    } catch (error) {
      console.error("Error while disliking video: ", error);
    }
  };

  const handleRemoveDislike = async () => {
    try {
      const req = await axios.delete(`http://localhost:7070/removeDislike?user=${userId}&videoId=${videoId}`, {
        withCredentials: true
      });
      console.log(req.data);
      setDislike(false);
    } catch (error) {
      console.error("Error while removing dislike: ", error);
    }
  }

  const handleRemoveStar = async () => {
    try {
      const res = await axios.delete(`http://localhost:7070/removeStar?user=${userId}&videoId=${videoId}`, {
        withCredentials: true
      });
      console.log(res.data);
      setIsStarred(false);
    } catch (error) {
      console.error("Error while removing star: ", error);
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
            <p className="">{totalSubscribers.length} subscribers</p>
          </div>
          <div className="w-[40%] flex items-center pl-2">
            {creatorName !== currentUser?.name && (
              <button
                type="button"
                className={`px-4 py-2 font-bold font-Code ${
                  subscribed ? "bg-black text-white" : "bg-white text-black"
                }`}
                onClick={() => {
                  if (!subscribed) {
                    handleSubscribe();
                    toast({
                      title: "Successfully subscribed!",
                      description: `You are now following ${creatorName}`,
                      status: "success",
                      duration: 4000,
                      isClosable: true,
                    })
                  } else {
                    handleUnsubscribe();
                    toast({
                      title: "Successfully unsubscribed",
                      description: `You have unsubscribed from ${creatorName}`,
                      status: "info",
                      duration: 4000,
                      isClosable: true,
                    });
                  }
                }}
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
                <button
                  type="button"
                  className="p-3 text-white text-[1.4rem]"
                  onClick={() => {
                    if((!isStarred && !dislike) || (!isStarred && dislike)){
                      handleStarVideo();
                      toast({
                        title: "Successfully starred!",
                        description: `This video has been added to your stars`,
                        status: "success",
                        duration: 4000,
                        isClosable: true,
                      });
                      setDislike(false);
                    } else if(isStarred && !dislike){
                      handleRemoveStar();
                      toast({
                        title: "Successfully removed star!",
                        description: `This video with id ${videoId} has been removed from your stars`,
                        status: "info",
                        duration: 4000,
                        isClosable: true,
                      });
                    }
                  }}
                >
                  {isStarred ? (
                    <FaStar className="text-[1.4rem]" />
                  ) : (
                    <FaRegStar className="text-[1.4rem]" />
                  )}
                </button>
              </div>
              <div className="w-1/2 pr-3">
                <button
                  type="button"
                  className="p-3 border-r-[1px] border-slate-600 text-white text-[1.4rem]"
                  onClick={() => {
                    if((!dislike && !isStarred) || (!dislike && isStarred)){
                      handleDislikeVideo();
                      toast({
                        title: "Successfully disliked!",
                        description: `This video has been added to your dislikes`,
                        status: "info",
                        duration: 4000,
                        isClosable: true,
                      });
                      setIsStarred(false);
                    } else if(dislike && !isStarred){
                      handleRemoveDislike();
                      toast({
                        title: "Successfully removed dislike!",
                        description: `This video with id ${videoId} has been removed from your dislikes`,
                        status: "success",
                        duration: 4000,
                        isClosable: true,
                      });
                    }
                  }}
                >
                  {dislike ? (
                    <BiSolidDislike className="text-[1.4rem]" />
                  ) : (
                    <BiDislike className="text-[1.4rem]" />
                  )}
                </button>
              </div>
              <div className="w-1/2 pr-3">
                <button
                  type="button"
                  className="p-3 pl-0 text-white text-[1.4rem]"
                >
                  <FaNoteSticky className="text-[1.4rem]" />
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
