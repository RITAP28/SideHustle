import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface filesProps {
  filename: string;
  template: string;
  content: string;
  userId: number;
  username: string;
}

const Files = () => {
    const navigate = useNavigate();

  const [allFiles, setAllFiles] = useState<filesProps[]>([]);
  const [, setFilesLoading] = useState<boolean>(false);

  const urlParams = new URLSearchParams(window.location.search);
  const userId = Number(urlParams.get("userId"));

  const handleGetAllFiles = useCallback(async () => {
    setFilesLoading(true);
    try {
      const files = await axios.get(
        `http://localhost:7070/getallfiles?userId=${userId}`,
        {
          withCredentials: true,
        }
      );
      console.log(files.data);
      setAllFiles(files.data.files);
    } catch (error) {
      console.error("Error while fetching all files: ", error);
    }
    setFilesLoading(false);
  }, [userId]);

  useEffect(() => {
    handleGetAllFiles();
  }, [handleGetAllFiles]);

  return (
    <div className="w-full min-h-screen pt-[5rem] bg-black">
      <div className="font-Code text-white">All your files</div>
      <div className="">
        {allFiles.map((file, index) => (
          <div
            className="hover:cursor-pointer hover:bg-slate-600"
            key={index}
            onClick={() => {
                navigate(`/editor?userId=${userId}&filename=${file.filename}`);
            }}
          >
            <div className="text-white">{file.filename}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Files;
