import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

interface Video {
  videoId: number;
  title: string;
  link: string;
  thumbnail: string;
  publisherId: number;
  dateOfPublishing: Date;
}

const Home = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const handleGetAllPosts = async () => {
    try {
      const res = await axios.get<Video[]>(
        "http://localhost:7070/getallvideos"
      );
      console.log(res.data);
      setVideos(res.data);
    } catch (error) {
      console.error("Error getting all posts in the frontend: ", error);
    }
  };

  useEffect(() => {
    handleGetAllPosts();
  }, []);

  return (
    <>
      <div className="flex flex-row pt-[5rem]">
        <div className="basis-1/6 bg-black w-full">
          <Sidebar />
        </div>
        {videos.length > 0 && (
          <div className="basis-5/6 w-full flex justify-center bg-black min-h-screen">
            <div className="grid grid-cols-3 grid-rows-3 gap-7 mx-2 w-[83%]">
              {videos.map((video, index) => (
                <div
                  key={index}
                  className="text-black hover:cursor-pointer w-full h-[15rem] py-[2rem]"
                  onClick={() => {
                    navigate(
                      `/videos?creator=${video.publisherId}&videoId=${video.videoId}&title=${video.title}`
                    );
                  }}
                >
                  <div className="w-full h-full object-cover border-2 border-white">
                    <img
                      src={video.thumbnail}
                      alt=""
                      className="w-full h-full rounded-none shadow-xl"
                    />
                  </div>
                  <div className="pt-4 text-white font-bold font-Code text-sm">
                    {video.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {videos.length === 0 && (
          <div className="basis-5/6 w-full min-h-screen bg-black">
            <div className="flex flex-col">
            <div className="font-Code text-yellow-400 flex justify-center">
              Oops! Looks no one has uploaded videos up until now
            </div>
            <div className="flex justify-center text-white font-Code font-bold text-2xl pt-4">How about you upload one?</div>
          </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
