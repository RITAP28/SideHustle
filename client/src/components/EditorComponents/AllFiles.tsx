import axios from "axios";
import { useCallback, useEffect, useState } from "react";

interface FileProps {
    filename: string;
    template: string;
    content: string;
    version: string;
    username: string;
    userId: number;
    createdAt: Date;
}

const AllFiles = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = Number(urlParams.get("userId"));
    const filename = String(urlParams.get("filename"));

    const [, setFile] = useState<FileProps | null>(null);

    const handleFetchFile = useCallback(async () => {
        try {
            const file = await axios.get(`http://localhost:7070/getfile?userId=${userId}&filename=${filename}`, {
                withCredentials: true
            });
            console.log(file.data);
            setFile(file.data.file);
        } catch (error) {
            console.error("Error while fetching file: ", error);
        }
    }, [userId, filename]);

    useEffect(() => {
        handleFetchFile();
    }, [handleFetchFile]);

  return (
    <div className="w-full min-h-screen">
        <div className="w-full flex justify-center font-Code font-bold text-white">
             
        </div>
    </div>
  )
}

export default AllFiles