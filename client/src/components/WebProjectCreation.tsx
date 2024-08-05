// import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import {
  frontendTech,
  backendTech,
  otherTech,
  databaseTech,
} from "../utils/constants";
import { FaReact } from "react-icons/fa";
import { FaAngular } from "react-icons/fa";
import { IoLogoVue } from "react-icons/io5";
import { RiNextjsFill } from "react-icons/ri";
import { LiaNode } from "react-icons/lia";
import { FaGolang } from "react-icons/fa6";
import { FaRust } from "react-icons/fa";
import { FaPython } from "react-icons/fa";
import { SiMysql } from "react-icons/si";
import { SiSqlite } from "react-icons/si";
import { SiMongodb } from "react-icons/si";
import { BiLogoPostgresql } from "react-icons/bi";
import { SiPrisma } from "react-icons/si";
import { SiDrizzle } from "react-icons/si";
import { useNavigate } from "react-router-dom";

const WebProjectCreation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const handleLogoData = (language: string) => {
    if (language === "React") {
      return <FaReact className="" />;
    } else if (language === "Angular") {
      return <FaAngular className="" />;
    } else if (language === "Vue") {
      return <IoLogoVue className="" />;
    } else if (language === "NextJS") {
      return <RiNextjsFill className="" />;
    } else if (language === "NodeJS") {
      return <LiaNode className="" />;
    } else if (language === "Golang") {
      return <FaGolang className="" />;
    } else if (language === "Python") {
      return <FaPython className="" />;
    } else if (language === "Rust") {
      return <FaRust className="" />;
    } else if (language === "MySQL") {
      return <SiMysql className="" />;
    } else if (language === "PostgreS") {
      return <BiLogoPostgresql className="" />;
    } else if (language === "SQLite") {
      return <SiSqlite className="" />;
    } else if (language === "MongoDB") {
      return <SiMongodb className="" />;
    } else if (language === "Prisma") {
      return <SiPrisma className="" />;
    } else if (language === "Drizzle") {
      return <SiDrizzle className="" />;
    }
  };

  return (
    <>
      <div className="w-full">
        <div className="w-full font-Code font-bold text-white pt-4">
          Start a Web Project:
        </div>
        <div className="w-full pt-4">
          <button
            type="button"
            className="px-4 py-1 font-Code font-semibold text-white hover:text-black hover:bg-white transition ease-in-out duration-300 bg-black border-2 border-white"
            onClick={onOpen}
          >
            Choose the tech stack!
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <Modal isOpen={isOpen} onClose={onClose} isCentered size={"xl"}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton className="text-white hover:bg-slate-700" />
            <div className="bg-slate-800 text-white">
              <div className="w-full flex justify-center py-3 font-Code font-bold">
                Choose your preferred tech stack:
              </div>
              <ModalBody>
                <div className="w-full flex flex-row">
                  <div className="basis-1/4 w-full font-Philosopher">
                    <div className="w-full flex justify-center">Frontend</div>
                    <div className="w-full">
                      {frontendTech.map((tech, index) => (
                        <div className="py-2 w-[90%]" key={index}>
                          <div className="flex justify-center">
                            <button
                              type="button"
                              className="border-2 border-white w-full py-1 hover:bg-white hover:text-black transition ease-in-out duration-100"
                            >
                              <div className="flex flex-row">
                                <div className="basis-1/3 flex justify-end items-center hover:text-black">
                                  {handleLogoData(tech.name)}
                                </div>
                                <div className="basis-2/3 flex justify-center items-center font-bold hover:text-black">
                                  {tech.name}
                                </div>
                              </div>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="basis-1/4 w-full font-Philosopher">
                    <div className="w-full flex justify-center">Backend</div>
                    <div className="w-full">
                      {backendTech.map((tech, index) => (
                        <div className=" py-2 w-[90%]" key={index}>
                          <div className="flex justify-center">
                            <button
                              type="button"
                              className="border-2 border-white w-full py-1 hover:bg-white hover:text-black transition ease-in-out duration-100"
                            >
                              <div className="flex flex-row">
                                <div className="basis-1/3 flex justify-end items-center hover:text-black">
                                  {handleLogoData(tech.name)}
                                </div>
                                <div className="basis-2/3 flex justify-center items-center font-bold hover:text-black">
                                  {tech.name}
                                </div>
                              </div>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="basis-1/4 w-full font-Philosopher">
                    <div className="w-full flex justify-center">Database</div>
                    <div className="w-full">
                      {databaseTech.map((tech, index) => (
                        <div className=" py-2 w-[95%]" key={index}>
                          <div className="flex justify-center">
                            <button
                              type="button"
                              className="border-2 border-white w-full py-1 hover:bg-white hover:text-black transition ease-in-out duration-100"
                            >
                              <div className="flex flex-row">
                                <div className="basis-1/3 flex justify-end items-center hover:text-black">
                                  {handleLogoData(tech.name)}
                                </div>
                                <div className="basis-2/3 flex justify-center items-center font-bold hover:text-black">
                                  {tech.name}
                                </div>
                              </div>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="basis-1/4 w-full font-Philosopher">
                    <div className="w-full flex justify-center">Others</div>
                    <div className="w-full">
                      {otherTech.map((tech, index) => (
                        <div
                          className=" py-2 w-[90%] flex justify-center"
                          key={index}
                        >
                          <div className="flex justify-center w-full">
                            <button
                              type="button"
                              className="border-2 border-white w-full py-1 hover:bg-white hover:text-black transition ease-in-out duration-100"
                            >
                              <div className="flex flex-row">
                                <div className="basis-1/3 flex justify-end items-center hover:text-black">
                                  {handleLogoData(tech.name)}
                                </div>
                                <div className="basis-2/3 flex justify-center items-center font-bold hover:text-black">
                                  {tech.name}
                                </div>
                              </div>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="w-full flex justify-center pt-[2rem]">
                  <button
                    type="button"
                    className="px-4 py-1 border-2 border-slate-600 hover:bg-slate-600 hover:text-white transition ease-in-out duration-150 font-Code text-[15px] rounded-md"
                    onClick={() => {
                      navigate('/webproject');
                    }}
                  >
                    {`Launch this damn project :)`}
                  </button>
                </div>
                <div className="w-full pt-[2rem] flex justify-center text-[10px] font-Philosopher">
                  <p>
                    p.s. you can always import packages after clicking on
                    'launch',
                  </p>
                </div>
                <div className="w-full flex justify-center text-[14px] font-Philosopher">
                  <p>this is just the beginning!</p>
                </div>
              </ModalBody>
            </div>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default WebProjectCreation;
