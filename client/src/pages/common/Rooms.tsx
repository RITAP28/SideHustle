import { useDisclosure, useToast } from "@chakra-ui/react";
import Sidebar from "../../components/Sidebar";
// import Modal from "../../components/Modal";
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Modal,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAppSelector } from "../../redux/hooks/hook";
import axios from "axios";

const Rooms = () => {
  const { currentUser } = useAppSelector((state) => state.user);
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
    } catch (error) {
      console.error("Error while creating room: ", error);
    }
  };

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
            <div className=""></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Rooms;
