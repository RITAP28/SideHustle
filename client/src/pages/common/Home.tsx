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
                <div className="w-full h-full object-cover">
                  <img
                    src={video.thumbnail}
                    alt=""
                    className="w-full h-full rounded-xl shadow-xl"
                  />
                </div>
                <div className="pt-4 text-white font-bold font-Code text-sm">{video.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
