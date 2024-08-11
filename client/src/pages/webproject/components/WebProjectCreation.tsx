import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Textarea } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import {
  frontendTech,
  backendTech,
  otherTech,
  databaseTech,
} from "../../../utils/constants";
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
import { FaFolder } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { LuDot } from "react-icons/lu";
import { IoMdMore } from "react-icons/io";

interface ProjectProps {
  projectId: number;
  projectName: string;
  description?: string;
  projectLink? : string;
  createAt: Date;
  updatedAt: Date;
  userName: string;
}

const WebProjectCreation = () => {
  const [newProject, setNewProject] = useState<boolean | null>(null);
  const [githubProject, setGithubProject] = useState<boolean | null>();
  const [techStack, setTechStack] = useState<boolean | null>(null);
  const [blankProject, setBlankProject] = useState<boolean | null>(null);

  const [projectName, setProjectName] = useState<string>("");
  const [, setRepoLink] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [, setProjectLink] = useState<string>("");
  const [allProjects, setAllProjects] = useState<ProjectProps[]>([]);

  // loading states
  const [blankProjectLoading, setBlankProjectLoading] =
    useState<boolean>(false);
  const [fetchProjectLoading, setFetchProjectLoading] =
    useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const URLParams = new URLSearchParams(window.location.search);
  const userId = Number(URLParams.get("userId"));
  const userName = String(URLParams.get("username"));

  const handleBlankProject = async () => {
    setBlankProjectLoading(true);
    try {
      const project = await axios.post(
        "http://localhost:8082/createBlankProject",
        {
          projectName: projectName,
          userId: userId,
          userName: userName,
          description: description,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Project details: ", project.data);
      setProjectLink(project.data.link);
      navigate(project.data.link);
    } catch (error) {
      console.error("Error while creating blank project: ", error);
    }
    setBlankProjectLoading(false);
  };

  const handleFetchProjects = async (userId: number) => {
    setFetchProjectLoading(true);
    try {
      const projects = await axios.get(
        `http://localhost:8082/getprojects?userId=${userId}`,
        {
          withCredentials: true,
        }
      );
      console.log(`Projects of user with id ${userId}: `, projects.data);
      setAllProjects(projects.data.projects);
    } catch (error) {
      console.error("Error while fetching projects: ", error);
    }
    setFetchProjectLoading(false);
  };

  useEffect(() => {
    handleFetchProjects(userId);
  }, [userId]);

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

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  return (
    <>
      <div className="w-full">
        <div className="w-full font-Code font-bold text-white pt-4 flex justify-center">
          Start a Web Project:
        </div>
        <div className="w-full flex flex-row pt-4">
          <div className="basis-1/2 flex justify-end pr-2">
            <button
              type="button"
              className="px-4 py-1 font-Code font-semibold text-white hover:text-black hover:bg-white transition ease-in-out duration-300 bg-black border-2 border-white"
              onClick={onOpen}
            >
              Launch here!
            </button>
          </div>
          <div className="basis-1/2 flex justify-start pl-2">
            <button
              type="button"
              className="px-4 py-1 font-Code font-semibold text-white hover:text-black hover:bg-white transition ease-in-out duration-300 bg-black border-2 border-white"
            >
              Your Projects
            </button>
          </div>
        </div>
        <div className="w-full text-white flex justify-center pt-4">
          <div className="w-[70%]">
            {fetchProjectLoading ? "Fetching your projects..." : (
              allProjects.length > 0 ? (allProjects.map((project, index) => (
                <>
                  <div
                    key={index}
                    className="w-full flex flex-row border-2 border-white py-2 my-1 hover:bg-white transition ease-in-out duration-150 hover:cursor-pointer hover:text-black hover:border-black rounded-md"
                    onClick={() => {
                      navigate(String(project.projectLink))
                    }}
                  >
                    <div className="w-[20%] flex justify-center items-center">
                      <FaFolder className="text-4xl" />
                    </div>
                    <div className="w-[90%] flex flex-col">
                      <div className="w-full font-Philosopher font-bold text-xl">
                        {project.projectName}
                      </div>
                      <div className="w-full flex flex-row items-center font-Philosopher">
                        @{project.userName} <LuDot />{" "}
                        {formatDistanceToNow(new Date(project.updatedAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                    <div className="w-[10%] flex items-center justify-start">
                      <IoMdMore className="text-4xl hover:bg-black hover:text-white transition ease-in-out duration-150 py-1 px-1 rounded-md" />
                    </div>
                  </div>
                </>
              ))) : (
                <>
                <div className="w-full flex justify-center">
                  <p className="font-Code font-semibold text-xl text-yellow-300">
                   You have created no new projects
                  </p>
                </div>
                </>
              )
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <Modal isOpen={isOpen} onClose={onClose} isCentered size={"xl"}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton
              className="text-white hover:bg-slate-700"
              onClick={() => {
                setBlankProject(false);
                setGithubProject(false);
                setNewProject(false);
                setTechStack(false);
              }}
            />
            <div className="bg-slate-800 text-white">
              <div className="w-full flex justify-center py-3 font-Code font-bold">
                Configure your settings:
              </div>
              <ModalBody>
                <div className="w-full flex flex-row bg-slate-800 pb-4">
                  <div className="basis-1/2 w-full flex justify-center">
                    <button
                      type="button"
                      className="px-2 py-1 border-2 border-white font-Code font-semibold hover:bg-white hover:text-slate-800 transition ease-in-out duration-150"
                      onClick={() => {
                        setGithubProject(true);
                        setNewProject(false);
                        setTechStack(false);
                      }}
                    >
                      Import from Github
                    </button>
                  </div>
                  <div className="basis-1/2 w-full flex justify-center">
                    <button
                      type="button"
                      className={`px-2 py-1 border-2 border-white font-Code font-semibold hover:bg-white hover:text-slate-800 transition ease-in-out duration-150`}
                      onClick={() => {
                        setNewProject(true);
                        setGithubProject(false);
                      }}
                    >
                      New Project
                    </button>
                  </div>
                </div>
                {newProject && (
                  <>
                    <div className="w-full flex justify-center font-Code font-semibold pt-4 pb-2">
                      <p className="underline">Starting a new project:</p>
                    </div>
                    <div className="w-full flex flex-col">
                      <div className="w-full flex flex-row py-2">
                        <div className="w-[50%]">
                          <p className="font-Code text-sm">
                            Start with a blank project:
                          </p>
                        </div>
                        <div className="w-[50%] flex justify-center items-center">
                          <button
                            type="button"
                            className="px-2 py-1 border-2 border-white font-Code font-semibold hover:bg-white hover:text-slate-800 transition ease-in-out duration-150"
                            onClick={() => {
                              setBlankProject(true);
                              setTechStack(false);
                            }}
                          >
                            Blank Project
                          </button>
                        </div>
                      </div>
                      <div className="w-full flex flex-row py-2">
                        <div className="w-[50%]">
                          <p className="font-Code text-sm">
                            Start with an initial tech-stack:
                          </p>
                        </div>
                        <div className="w-[50%] flex justify-center items-center">
                          <button
                            type="button"
                            className="px-2 py-1 border-2 border-white font-Code font-semibold hover:bg-white hover:text-slate-800 transition ease-in-out duration-150"
                            onClick={() => {
                              setTechStack(true);
                              setBlankProject(false);
                            }}
                          >
                            Choose your tech-stack
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {githubProject && (
                  <>
                    <div className="w-full flex flex-row pt-4">
                      <div className="basis-1/2 flex justify-center items-center">
                        <p className="font-Code text-sm font-semibold">
                          Repo Link:
                        </p>
                      </div>
                      <div className="basis-1/2 flex justify-center items-center">
                        <input
                          type="text"
                          name=""
                          className="font-Code px-2 py-1 text-slate-800 font-semibold w-[300px]"
                          placeholder="repo link"
                          onChange={(e) => {
                            setRepoLink(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-full flex justify-center pt-[2rem] pb-2">
                      <button
                        type="button"
                        className="px-2 py-1 border-2 border-white font-Code font-semibold hover:bg-white hover:text-slate-800 transition ease-in-out duration-150"
                      >
                        Clone and Initialise
                      </button>
                    </div>
                  </>
                )}
                {blankProject && (
                  <>
                    <div className="w-full flex justify-center pt-[1rem]">
                      <hr className="text-slate-600 w-[80%]" />
                    </div>
                    <div className="w-full flex flex-row pt-6 pb-4">
                      <div className="w-[40%] flex justify-center items-center">
                        <p className="font-Code font-semibold text-sm">
                          Name of the project:
                        </p>
                      </div>
                      <div className="w-[60%] flex justify-center items-center">
                        <input
                          type="text"
                          name=""
                          className="font-Code px-2 py-1 text-slate-800 font-semibold w-[300px]"
                          placeholder="name of the project"
                          onChange={(e) => {
                            setProjectName(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-full flex flex-row pt-6 pb-4">
                      <div className="w-[40%] flex justify-center items-center">
                        <p className="font-Code font-semibold text-sm">
                          {`Description(optional):`}
                        </p>
                      </div>
                      <div className="w-[60%] flex justify-center items-center">
                        <Textarea
                          placeholder="Tell learners about what you are teaching"
                          size="sm"
                          variant={"filled"}
                          width={"80%"}
                          className="ml-4 font-Code focus:text-white text-black font-semibold"
                          resize={"none"}
                          onChange={handleDescriptionChange}
                        />
                      </div>
                    </div>
                    <div className="w-full flex justify-center py-4">
                      <button
                        type="button"
                        className="px-4 py-1 border-2 border-slate-600 hover:bg-slate-600 hover:text-white transition ease-in-out duration-150 font-Code text-[15px] rounded-md"
                        onClick={() => {
                          handleBlankProject();
                        }}
                      >
                        {blankProjectLoading
                          ? `Launching...`
                          : `Launch this damn project :)`}
                      </button>
                    </div>
                  </>
                )}
                {techStack && (
                  <>
                    <div className="w-full flex justify-center py-4">
                      <hr className="w-[80%]" />
                    </div>
                    <div className="w-full pb-4">
                      <div className="w-full flex flex-row">
                        <div className="w-[40%] flex justify-center items-center">
                          <p className="font-Philosopher font-semibold text-lg">
                            Name of the project:
                          </p>
                        </div>
                        <div className="w-[60%] flex justify-center items-center">
                          <input
                            type="text"
                            name=""
                            className="px-2 py-1 text-slate-800 font-semibold w-[250px] text-sm font-Philosopher rounded-sm"
                            placeholder="name of the project"
                            onChange={(e) => {
                              setProjectName(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex flex-row">
                      <div className="basis-1/4 w-full font-Philosopher">
                        <div className="w-full flex justify-center">
                          Frontend
                        </div>
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
                        <div className="w-full flex justify-center">
                          Backend
                        </div>
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
                        <div className="w-full flex justify-center">
                          Database
                        </div>
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
                          navigate("/webproject");
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
                  </>
                )}
              </ModalBody>
            </div>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
};

export default WebProjectCreation;
