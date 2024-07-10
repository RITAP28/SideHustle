import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks/hook";
import { useToast } from "@chakra-ui/react";
import { User } from "../../types/types";
import Sender from "../../components/webRTCcomponents/Sender";
import Receiver from "../../components/webRTCcomponents/Receiver";

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
  // const videoRef = useRef<HTMLVideoElement>(null);
  const { currentUser } = useAppSelector((state) => state.user);
  const urlParams = new URLSearchParams(window.location.search);
  const toast = useToast();
  const roomId = Number(urlParams.get("roomId"));
  const roomName = String(urlParams.get("name"));
  const leaderId = Number(urlParams.get("leaderId"));
  const userId = Number(urlParams.get("userId"));

  const [room, setRoom] = useState<Room>();
  const [loading, setLoading] = useState<boolean>(false);
  const [socket, setSocket] = useState<null | WebSocket>(null);
  const [latestMessage, setLatestMessage] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [sender, setSender] = useState<string>();

  const handleGetUser = async (id: number) => {
    try {
      const user = await axios.get(`http://localhost:7070/getUser?id=${id}`, {
        withCredentials: true,
      });
      console.log(user.data);
      // setSender(user);
    } catch (error) {
      console.error("Error while getting the user: ", error);
    }
  };

  useEffect(() => {
    handleGetUser(userId);
  }, [userId]);

  const sendMessage = async (
    socket: WebSocket,
    message: string,
    currentUser: User
  ) => {
    const messagePayload: ChatEventProps = {
      text: message,
      sender: currentUser.name,
      senderId: currentUser.id,
      sentAt: new Date(),
    };
    socket.send(JSON.stringify(messagePayload));
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
      const parsedMessage: ChatEventProps = JSON.parse(message.data);
      console.log("Received message: ", parsedMessage.text);
      setLatestMessage(parsedMessage.text);
      console.log("Message sent by: ", parsedMessage.sender);
      setSender(parsedMessage.sender);
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
        <>
          <div className="flex justify-center">
            <div className="flex flex-row w-[96%] gap-4">
              <div className="basis-2/3">
                {room?.leader === currentUser?.name ? (
                    <Sender />
                ) : (
                  <div>
                    <Receiver />
                  </div>
                )}
              </div>
              <div className="basis-1/3 border-2 border-white flex flex-col">
                <div className="h-[85%] overflow-y-scroll">
                  <div className="h-[3rem] w-full">
                    <div className="">{sender}</div>
                    <div className="">{latestMessage}</div>
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
                        if (socket && currentUser) {
                          sendMessage(socket, message, currentUser);
                          setMessage("");
                          toast({
                            title: `message sent by ${currentUser?.name}`,
                            status: "success",
                            duration: 4000,
                            isClosable: true,
                          });
                        }
                      }}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default IndividualRoom;
