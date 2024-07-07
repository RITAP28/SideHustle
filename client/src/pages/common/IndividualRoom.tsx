import axios from "axios";
import { useCallback, useEffect, useState } from "react";

interface Room {
  id: number;
  roomName: string;
  roomLink: string;
  leader: string;
  leaderId: number;
  invitedMembers: number;
  createdAt: Date;
  status: string;
}

const IndividualRoom = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = Number(urlParams.get("roomId"));
  const roomName = String(urlParams.get("roomName"));
  const leaderId = Number(urlParams.get("leaderId"));

  const [room, setRoom] = useState<Room>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleGetIndividualRoom = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:7070/getIndividualRoom?roomId=${roomId}&roomName=${roomName}&leaderId=${leaderId}`,
        {
          withCredentials: true,
        }
      );
      console.log(res.data.individualRoom);
      setRoom(res.data.individualRoom);
    } catch (error) {
      console.error("Error getting the individual room: ", error);
    }
    setLoading(false);
  }, [roomName, roomId, leaderId]);

  useEffect(() => {
    handleGetIndividualRoom();
  }, [handleGetIndividualRoom]);

  return (
    <div className="w-full">
      {loading ? (
        "Loading..."
      ) : (
        <div className="">
          <h1>{room?.leader}</h1>
          <h2>{room?.roomName}</h2>
          <p className="">{room?.status}</p>
        </div>
      )}
    </div>
  );
};

export default IndividualRoom;
