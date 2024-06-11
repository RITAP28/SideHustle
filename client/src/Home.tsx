import axios from "axios";
import { useEffect, useState } from "react";

interface Video {
  id: string;
  title: string;
  link: string;
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
      <div className="grid grid-cols-3 gap-2">
        {videos.map((video, index) => (
          <div key={index}>
            <h1>{video.title}</h1>
            <p>{video.link}</p>
            <p>{new Date(video.dateOfPublishing).toLocaleDateString()}</p>
            <p>{video.id}</p>
          </div>
        ))}
      </div>
      Home
    </>
  );
};

export default Home;
