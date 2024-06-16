import axios from "axios";
import { useEffect, useState } from "react";

interface Video {
  id: string;
  title: string;
  link: string;
  thumbnail: string;
  publisherId: number;
  dateOfPublishing: Date;
}

const Home = () => {
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
          <div key={index} className="bg-black text-white">
            <div className="w-[400px] h-[120px] object-cover">
              <img src={video.thumbnail} alt="" className="w-full h-full" />
            </div>
            <div>
              {video.title}
            </div>
          </div>
        ))}
      </div>
      Home
    </>
  );
};

export default Home;
