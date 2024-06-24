import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <div className="basis-1/6 w-full bg-black border-r-2 border-slate-500">
          <div className="w-full text-white flex justify-center my-[1rem]">
            <button
              type="button"
              className="w-[80%] py-2 font-bold hover:cursor-pointer rounded-lg hover:bg-slate-500"
            >
              Home
            </button>
          </div>
          <div className="flex justify-center">
            <hr className="border-slate-600 w-[80%]" />
          </div>
          <div className="w-full text-white flex justify-center my-[1rem]">
            <button
              type="button"
              className="w-[80%] py-2 font-bold hover:cursor-pointer rounded-lg hover:bg-slate-500"
              onClick={() => {
                navigate("/upload");
              }}
            >
              Upload
            </button>
          </div>
          <div className="flex justify-center">
            <hr className="border-slate-600 w-[80%]" />
          </div>
          <div className="w-full text-white flex justify-center my-[1rem]">
            <button
              type="button"
              className="w-[80%] py-2 font-bold hover:cursor-pointer rounded-lg hover:bg-slate-500"
              onClick={() => {
                navigate("/profile");
              }}
            >
              Profile
            </button>
          </div>
          <div className="flex justify-center">
            <hr className="border-slate-600 w-[80%]" />
          </div>
          <div className="w-full text-white flex justify-center my-[1rem]">
            <button
              type="button"
              className="w-[80%] py-2 font-bold hover:cursor-pointer rounded-lg hover:bg-slate-500"
              onClick={() => {
                navigate("/editor");
              }}
            >
              Editor
            </button>
          </div>
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
