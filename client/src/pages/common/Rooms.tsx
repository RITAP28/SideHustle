import { useDisclosure, useToast } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar";
import { RiRadioButtonLine } from "react-icons/ri";
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Modal,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks/hook";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface RandomRooms {
  id: number;
  roomName: string;
  roomLink: string;
  leader: string;
  invitedMembers: number;
  leaderId: number;
  createdAt: Date;
  status: string;
}

const Rooms = () => {
  const { currentUser } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  const [randomRooms, setRandomRooms] = useState<RandomRooms[]>([]);
  const [randomRoomsLoading, setRandomRoomsLoading] = useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [formData, setFormData] = useState({
    roomName: "",
    maxMembers: 0,
    leader: `${currentUser?.name}`,
    leaderId: Number(`${currentUser?.id}`),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (formData.roomName === "" || formData.maxMembers === 0) {
        toast({
          title: "Please fill all the fields",
          description:
            "In order to generate a room link, you must fill all the fields in the form",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
      const res = await axios.post(`http://localhost:7070/makeRoom`, formData, {
        withCredentials: true,
      });
      console.log(res.data);
      console.log(formData);
      toast({
        title: "Room created successfully",
        description:
          "You have created a room to which you can invite people or your friends from your community",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error while creating room: ", error);
    }
  };

  const handleGetInProgressRooms = async () => {
    try {
      const res = await axios.get(`http://localhost:7070/getRandomRooms`, {
        withCredentials: true,
      });
      if (!res.data) {
        console.error("Error: no rooms found currently: ");
      }
      console.log(res.data.randomRooms);
      setRandomRooms(res.data.randomRooms);
    } catch (error) {
      console.error("Error while creating rooms: ", error);
    }
    setRandomRoomsLoading(false);
  };

  useEffect(() => {
    setRandomRoomsLoading(true);
    const timer = setTimeout(() => {
      handleGetInProgressRooms();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="">
        <Modal
          blockScrollOnMount={false}
          isOpen={isOpen}
          onClose={onClose}
          isCentered
          size={"xl"}
        >
          <ModalOverlay />
          <ModalContent backgroundColor={"gray"}>
            <h1 className="flex justify-center text-xl font-Code font-bold mt-3">
              Set Room Settings
            </h1>
            <ModalCloseButton />
            <ModalBody>
              <form action="" className="w-full" onSubmit={handleSubmit}>
                <div className="flex flex-row w-full">
                  <div className="w-[40%]">
                    <label
                      htmlFor=""
                      className="flex justify-center items-center text-slate-800 font-Code font-bold"
                    >
                      Name of the Room:
                    </label>
                  </div>
                  <div className="w-[60%] flex justify-between items-center">
                    <input
                      type="text"
                      id="roomName"
                      className="w-full border-2 text-white bg-black border-slate-400 font-Code pl-2 text-sm py-1"
                      placeholder="enter the room name"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex flex-row w-full mt-2">
                  <div className="w-[40%]">
                    <label
                      htmlFor=""
                      className="flex justify-center items-center text-slate-800 font-bold font-Code"
                    >
                      Maximum members:
                    </label>
                  </div>
                  <div className="w-[60%] flex justify-between items-center">
                    <input
                      type="number"
                      id="maxMembers"
                      className="w-full border-2 text-white bg-black border-slate-400 font-Code pl-2 text-sm py-1"
                      placeholder="enter number of members"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex flex-row w-full mt-2">
                  <div className="w-[40%]">
                    <label
                      htmlFor=""
                      className="flex justify-center items-center text-slate-800 font-bold font-Code"
                    >
                      Leader:
                    </label>
                  </div>
                  <div className="w-[60%] flex justify-between items-center">
                    <input
                      type="text"
                      id="leader"
                      readOnly
                      className="w-full border-2 text-white bg-black border-slate-400 font-Code pl-2 text-sm py-1"
                      defaultValue={`${currentUser?.name}`}
                    />
                  </div>
                </div>
                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    className="bg-black text-white font-Code font-bold px-4 py-2 hover:bg-white hover:text-black border-2 border-white rounded-md"
                  >
                    Generate Room Link
                  </button>
                </div>
              </form>
            </ModalBody>

            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>
      </div>
      <div className="pt-[5rem] w-full flex flex-row min-h-screen bg-black">
        <div className="basis-1/6">
          <Sidebar />
        </div>
        <div className="basis-5/6">
          <div className="flex justify-center">
            <div className="flex flex-col font-Code font-bold">
              <div className="">
                <button
                  type="button"
                  className="w-[10rem] py-2 bg-black text-white border-2 border-white hover:bg-white hover:text-black"
                  onClick={onOpen}
                >
                  Create a Room
                </button>
              </div>
              <div className="pt-4">
                <button
                  type="button"
                  className="w-[10rem] py-2 bg-black text-white border-2 border-white hover:bg-white hover:text-black"
                >
                  Join a Room
                </button>
              </div>
            </div>
          </div>
          <div className="text-white font-Code w-full pt-[3rem]">
            <div className="flex justify-center">
              <p className="underline">Rooms in progress</p>
            </div>
            <div className="flex justify-center">
              <div className="w-[90%] grid grid-cols-3 gap-2 pt-[3rem]">
                {randomRoomsLoading ? (
                  <div className="">
                    <p>fetching rooms for you, please wait...</p>
                  </div>
                ) : (
                  randomRooms.map((room, index) => (
                    <div className="border-2 border-white" key={index}>
                      <div className="w-full flex justify-center font-Code py-2 font-bold text-xl">
                        {room.roomName}
                      </div>
                      <div className="w-full">
                        <p className="pl-2">
                          Leader of the room:{" "}
                          <span className="underline">{room.leader}</span>
                        </p>
                      </div>
                      <div className="w-full">
                        <p className="pl-2">
                          Maximum members:{" "}
                          <span className="font-bold">
                            {room.invitedMembers}
                          </span>
                        </p>
                      </div>
                      <div className="w-full pt-2">
                        <div className="pl-2 flex flex-row">
                          <div className="flex items-center px-2">
                            <RiRadioButtonLine className="text-green-400" />
                          </div>
                          <div className="flex items-center">
                            <span>
                              {room.status === "INPROGRESS"
                                ? "IN PROGRESS"
                                : "ENDED"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center w-full pb-6 pt-[3rem]">
                        {currentUser?.name === room.leader ? (
                          
                          <div className="flex flex-row w-full">
                          <div className="basis-1/2 flex justify-center">
                            <button
                              type="button"
                              className="font-Code font-bold border-2 border-white px-3 py-1 hover:bg-white hover:text-black"
                              onClick={() => {
                                navigate(`${room.roomLink}`);
                              }}
                            >
                              Go to Room
                            </button>
                          </div>
                          <div className="basis-1/2 flex justify-center">
                            <button
                              type="button"
                              className="font-Code font-bold border-2 border-white px-3 py-1 hover:bg-white hover:text-black"
                            >
                              Invite
                            </button>
                          </div>
                        </div>
                        ) : (
                          <button
                            type="button"
                            className="font-Code font-bold border-2 border-white px-3 py-1 hover:bg-white hover:text-black"
                          >
                            Join
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Rooms;
