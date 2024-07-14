import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { User } from "../../types/types";
import { RxAvatar } from "react-icons/rx";

interface ReviewProps {
  videoId: number;
  userId: number;
  creatorId: number;
  reviewText: string;
  createdAt: Date;
}

const AllComments = ({
  creatorId,
  userId,
}: {
  creatorId: number;
  userId: number;
}) => {
  const [reviews, setReviews] = useState<ReviewProps[]>([]);
  const [totalReviews, setTotalReviews] = useState<number>(reviews.length);
  const [, setCreatorName] = useState<string>("");
  const [user, setUser] = useState<User>();

  const urlParams = new URLSearchParams(window.location.search);
  const videoId = Number(urlParams.get("videoId"));

  const handleGetReviews = useCallback(async () => {
      try {
        const reviewsByVideoId = await axios.get(
          `http://localhost:7070/getAllReviews?videoId=${videoId}`,
          {
            withCredentials: true,
          }
        );
        setReviews(reviewsByVideoId.data.reviewsByVideoId);
        setTotalReviews(reviews.length);
      } catch (error) {
        console.error(error);
      }
  }, [reviews.length, videoId]);

  useEffect(() => {
    handleGetReviews();
  }, [handleGetReviews]);

  const handleGetCreatorInfo = useCallback(async () => {
    try {
      const creatorInfo = await axios.get(
        `http://localhost:7070/getCreator?creator=${creatorId}`,
        {
          withCredentials: true,
        }
      );
      console.log(creatorInfo.data);
      setCreatorName(creatorInfo.data.creatorName);
    } catch (error) {
      console.error("Error while fetching creator info: ", error);
    }
  }, [creatorId]);

  useEffect(() => {
    handleGetCreatorInfo();
  }, [handleGetCreatorInfo]);

  const handlegetUserInfo = useCallback(async () => {
    try {
      const userInfo = await axios.get(
        `http://localhost:7070/getuser?id=${userId}`,
        {
          withCredentials: true,
        }
      );
      console.log(userInfo.data);
      setUser(userInfo.data.user);
    } catch (error) {
      console.error("Error while fetching user info: ", error);
    }
  }, [userId]);

  useEffect(() => {
    handlegetUserInfo();
  }, [handlegetUserInfo]);

  return (
    <div className="text-white w-full">
      <div className="w-full pt-4 font-Code font-bold text-xl">
        <p className="">{totalReviews} Reviews:</p>
      </div>
      <div className="w-full">
        {reviews.map((review, index) => (
          <div className="py-4" key={index}>
            <div className="w-full flex flex-row">
              <div className="flex items-start px-2 pt-1">
                <RxAvatar className="text-[2rem]" />
              </div>
              <div className="">
                <div className="w-full flex flex-row">
                <div className="font-Philosopher text-xl font-bold">{user?.name}</div>
                <div className="px-3 font-light text-sm flex items-center">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
                </div>
                <div className="py-2 font-Code">{review.reviewText}</div>
              </div>
            </div>
          </div>
        )).reverse()}
      </div>
    </div>
  );
};

export default AllComments;
