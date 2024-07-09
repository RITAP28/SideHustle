import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../redux/hooks/hook";
import { useToast } from "@chakra-ui/react";

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

interface ChatEventProps {
  text: string;
  sender: string;
  senderId: number;
  sentAt: Date;
}

const IndividualRoom = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  const urlParams = new URLSearchParams(window.location.search);
  const toast = useToast();
  const roomId = Number(urlParams.get("roomId"));
  const roomName = String(urlParams.get("name"));
  const leaderId = Number(urlParams.get("leaderId"));

  const [, setRoom] = useState<Room>();
  const [loading, setLoading] = useState<boolean>(false);
  const [socket, setSocket] = useState<null | WebSocket>(null);
  const [latestMessage, setLatestMessage] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const chatsArray = [];
  const chat: ChatEventProps = {
    text: "",
    sender: currentUser?.name as string,
    senderId: currentUser?.id as number,
    sentAt: new Date(),
  };

  const handleGetIndividualRoom = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:7070/getIndividualRoom?roomId=${roomId}&name=${roomName}&leaderId=${leaderId}`,
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

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");
    socket.onopen = () => {
      console.log("Connected to a socket port 8080");
      setSocket(socket);
      toast({
        title: "Connected to the chat",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    };
    socket.onmessage = (message) => {
      console.log("Received message: ", message);
      chat.sender = currentUser?.name as string;
      chatsArray.push(chat);
      setLatestMessage(message.data);
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-black text-white pt-[5rem]">
      {loading ? (
        "Loading..."
      ) : (
        <div className="flex justify-center">
          <div className="flex flex-row w-[96%] gap-4">
            <div className="basis-2/3">
              <video
                src=""
                className="w-full h-full object-contain aspect-video bg-slate-700"
              />
            </div>
            <div className="basis-1/3 border-2 border-white flex flex-col">
              <div className="h-[85%] overflow-y-scroll">
                <div className="h-[3rem] w-full">
                  {chatsArray.map((chat, index) => (
                    <div className="" key={index}>
                      <div className="w-full h-[1rem]">{chat}</div>
                      <div className="w-full h-[2rem]">{latestMessage}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-[15%] w-full border-t-2 border-slate-700 flex flex-row items-center">
                <div className="w-[80%] flex justify-center items-center">
                  <input
                    type="text"
                    name=""
                    className="w-[90%] px-2 py-1 bg-black text-white font-Code border-2 border-slate-600"
                    placeholder="chat here"
                    onChange={(e) => {
                      setMessage(e.target.value);
                    }}
                  />
                </div>
                <div className="w-[20%] flex justify-center">
                  <button
                    type="button"
                    className="hover:bg-white hover:text-black font-Code border-2 border-slate-800 px-4 py-2 font-bold rounded-lg bg-slate-800 text-white"
                    onClick={() => {
                      socket?.send(message);
                      setMessage("");
                      toast({
                        title: "message sent by fardin",
                        status: "success",
                        duration: 4000,
                        isClosable: true,
                      });
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndividualRoom;
