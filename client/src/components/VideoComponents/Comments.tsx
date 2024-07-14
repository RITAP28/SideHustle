import { useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useAppSelector } from "../../redux/hooks/hook";

const Comments = () => {
  const toast = useToast();
  const { currentUser } = useAppSelector((state) => state.user);
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = Number(urlParams.get("videoId"));
  const user = Number(urlParams.get("user"));
  const creator = Number(urlParams.get("creator"));

  const [reviewText, setReviewText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleReviewInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setReviewText(e.target.value);
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    try {
      const review = await axios.post(
        `http://localhost:7070/submitReview?creator=${creator}&user=${user}&videoId=${videoId}`,
        {
          reviewText,
        },
        {
          withCredentials: true,
        }
      );
      console.log(review);
      console.log(review.data);
      setReviewText("");
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="w-full flex justify-start">
        <p className="text-white font-Code font-bold text-xl">Review here:</p>
      </div>
      <div className="pt-4">
        <form
          action=""
          className="border-2 border-slate-800"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-center pt-[1rem] py-[2rem]">
            <div className="w-[80%]">
              <div className="w-full">
                <textarea
                  name=""
                  className="w-full bg-black text-white font-Code border-b-2 border-white text-sm resize-none overflow-y-auto min-h-[40px] max-h-[200px]"
                  placeholder="What's your review of the above video?"
                  onChange={handleReviewInput}
                />
              </div>
              <div className="">
                <button
                  type="submit"
                  className="px-4 py-2 border-2 border-white hover:bg-white hover:text-black font-Code font-bold text-white"
                  onClick={() => {
                    console.log("Review Submitted");
                    toast({
                      title: "Review Submitted successfully",
                      description: `Thanks for the review, ${currentUser?.name}. This will help other developers to save their time.`,
                      status: "success",
                      duration: 4000,
                      isClosable: true,
                    });
                  }}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Comment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Comments;
