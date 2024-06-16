import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Video {
  videoId: string;
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
      <div className="grid grid-cols-3 gap-2 mx-2">
        {videos.map((video, index) => (
          <div key={index} className="bg-black text-white hover:cursor-pointer" onClick={() => {
            navigate(`/videos?creator=${video.publisherId}&videoid=${video.videoId}&title=${video.title}`);
          }}>
            <div className="w-[400px] h-[120px] object-cover">
              <img src={`${video.thumbnail}`} alt="" className="w-full h-full" />
            </div>
            <div>
              {video.title}
            </div>
            <div>
              {video.videoId}
            </div>
          </div>
        ))}
      </div>
      Home
    </>
  );
};

export default Home;
