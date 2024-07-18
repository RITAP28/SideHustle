import { FaPlay } from "react-icons/fa";
import { IoPlayBack } from "react-icons/io5";
import { IoPlayForward } from "react-icons/io5";
import { FaPause } from "react-icons/fa";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoIosSettings } from "react-icons/io";
import { MdFullscreen } from "react-icons/md";
import axios from "axios";
import { useAppDispatch } from "../../redux/hooks/hook";
import { CurrentVideo } from "../../redux/Slices/video.slice";
import { Video } from "../../types/types";
import Hls from "hls.js";
import MonacoEditor from "../../components/MonacoEditor";
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import CreatorInfo from "../../components/CreatorInfo";
import Comments from "../../components/VideoComponents/Comments";
import AllComments from "../../components/VideoComponents/AllComments";
// import { MdFullscreenExit } from "react-icons/md";

function Videos() {
  // const { currentUser } = useAppSelector((state) => state.user);
  // const { currentVideo } = useAppSelector((state) => state.video);
  const [video, setVideo] = useState<Video>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = Number(urlParams.get("videoId"));
  const creatorId = Number(urlParams.get("creator"));
  const userId = Number(urlParams.get("user"));
  const dispatch = useAppDispatch();

  const togglePlayPause = () => {
    if (videoRef.current !== null && videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(false);
    } else {
      videoRef.current?.pause();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current?.currentTime as number);
  };

  const handleLoadedMetaData = () => {
    setDuration(videoRef.current?.duration as number);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current !== null) {
      videoRef.current.currentTime = parseFloat(e.target.value);
    }
  };

  const handleGetVideo = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:7070/videos?videoId=${videoId}`,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      dispatch(CurrentVideo(res.data.video));
      setVideo(res.data.video);
    } catch (error) {
      console.error("Error while loading the video: ", error);
    }
    setLoading(false);
  }, [videoId, dispatch]);

  useEffect(() => {
    handleGetVideo();
  }, [handleGetVideo]);

  const handleHLSVideoPlayer = useCallback(async () => {
    const videoSrc = String(video?.link);
    try {
      if (videoRef.current) {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(videoSrc);
          hls.attachMedia(videoRef.current);
          hls.on(Hls.Events.MANIFEST_PARSED, function () {
            videoRef.current!.play();
          });
        } else if (
          videoRef.current.canPlayType("application/vnd.apple.mpegurl")
        ) {
          videoRef.current.src = videoSrc;
          videoRef.current.addEventListener("canplay", function () {
            videoRef.current!.play();
          });
        }
      }
    } catch (error) {
      console.error("Error while playing video in the player: ", error);
    }
  }, [video?.link]);

  useEffect(() => {
    handleHLSVideoPlayer();
  }, [handleHLSVideoPlayer]);

  const handleIsSubscribed = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:7070/isSubscribed?creator=${creatorId}&user=${userId}`,
        {
          withCredentials: true,
        }
      );
      console.log(res.data);
      setIsSubscribed(res.data.success);
    } catch (error) {
      console.error(
        "Error while checking whether the user is subscribed or not: ",
        error
      );
    }
  }, [creatorId, userId]);

  useEffect(() => {
    handleIsSubscribed();
  }, [handleIsSubscribed]);

  return (
    <>
      <div className="w-full min-h-screen bg-black pt-[5rem] pb-[2rem]">
        {loading ? (
          "Loading..."
        ) : (
          <>
            <div className="pt-2 ml-[2rem] flex flex-row gap-4">
              <div className="w-[60%] h-[95%] pt-[2.5rem] overflow-y-auto">
                {/* video part */}
                {/* scrollable content in the page */}
                <div className="w-full">
                  <p className="font-Code font-bold text-white text-lg">
                    <span className="underline">title</span>: {video?.title}
                  </p>
                </div>
                <div className="flex justify-center pt-[0.5rem]">
                  <video
                    id="fullScreen"
                    controls={false}
                    className="w-full h-full object-contain aspect-video bg-slate-700 rounded-xl"
                    ref={videoRef}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetaData}
                  >
                    <source src={video?.link} type="application/x-mpegURL" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="flex flex-row w-full pt-2">
                  <div className="basis-3/10 flex flex-row">
                    <div className="basis-1/3">
                      {/* <IoPlayBack className="text-white text-xl" /> */}
                      <Box
                        bg={"black"}
                        as={Button}
                        _hover={{ background: "none" }}
                      >
                        <IoPlayBack className="text-white text-xl" />
                      </Box>
                    </div>
                    <div className="basis-1/3 mx-2">
                      {duration === 0 ? (
                        <Box
                          bg={"black"}
                          as={Button}
                          _hover={{ background: "none" }}
                          onClick={() => {
                            if (videoRef.current !== null) {
                              videoRef.current.play();
                              setIsPlaying(true);
                            }
                          }}
                        >
                          <FaPause className="text-white text-xl" />
                        </Box>
                      ) : (
                        <div>
                          {isPlaying ? (
                            <Box
                              bg={"black"}
                              as={Button}
                              _hover={{ background: "none" }}
                              onClick={togglePlayPause}
                            >
                              <FaPlay className="text-white text-xl" />
                            </Box>
                          ) : (
                            <Box
                              bg={"black"}
                              as={Button}
                              _hover={{ background: "none" }}
                              onClick={togglePlayPause}
                            >
                              <FaPause className="text-white text-xl" />
                            </Box>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="basis-1/3">
                      <Box
                        bg={"black"}
                        as={Button}
                        _hover={{ background: "none" }}
                      >
                        <IoPlayForward className="text-white text-xl" />
                      </Box>
                    </div>
                  </div>
                  <div className="basis-5/10 w-full mx-4 mt-3">
                    <input
                      type="range"
                      className="w-full"
                      min="0"
                      max={duration}
                      value={currentTime}
                      onChange={handleSeek}
                    />
                  </div>
                  <div className="basis-1/10 font-Code text-sm bg-black">
                    <Box bg={"black"}>
                      <Menu isLazy placement="top-end">
                        <MenuButton
                          as={Button}
                          bg={"black"}
                          _hover={{ background: "none" }}
                        >
                          <IoIosSettings className="text-xl text-white" />
                        </MenuButton>
                        <MenuList bg="black" mb={2}>
                          <MenuItem
                            bg={"black"}
                            fontStyle={"bold"}
                            color={"whitesmoke"}
                            _hover={{ background: "gray.800" }}
                          >
                            Playback Speed
                          </MenuItem>
                          <MenuItem
                            bg={"black"}
                            fontStyle={"bold"}
                            color={"whitesmoke"}
                            _hover={{ background: "gray.800" }}
                          >
                            Quality
                          </MenuItem>
                          <MenuItem
                            bg={"black"}
                            fontStyle={"bold"}
                            color={"whitesmoke"}
                            _hover={{ background: "gray.800" }}
                          >
                            Subtitles
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Box>
                  </div>
                  <div className="basis-1/10">
                    {/* <MdFullscreen className="text-white text-xl" /> */}
                    <Box
                      bg={"black"}
                      as={Button}
                      _hover={{ background: "none" }}
                    >
                      <MdFullscreen className="text-white text-2xl" />
                    </Box>
                  </div>
                </div>

                {/* metadata of the video */}
                <div className="w-full pt-[2rem]">
                  <div className="w-full bg-slate-600 pb-4 px-2 rounded-lg">
                    <div className="w-full font-Code font-semibold">
                      <p className="">
                        5000 views{" "}
                        <span className="px-2">
                          {video?.dateOfPublishing !== undefined &&
                            new Date(
                              video?.dateOfPublishing
                            ).toLocaleDateString()}
                        </span>{" "}
                      </p>
                    </div>
                    <div className="w-full text-white py-4">
                      <CreatorInfo
                        userId={userId}
                        creatorId={creatorId}
                        isSubscribed={isSubscribed}
                        videoId={videoId}
                      />
                    </div>
                    <div className="w-full pt-2">
                      <p className="font-Code text-white font-semibold">
                        {video?.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* comment section */}
                <div className="w-full pt-[2rem]">
                  <Comments />
                </div>

                {/* all comments */}
                <AllComments creatorId={creatorId} />
              </div>

              {/* the editor should be unscrollable */}
              <div className="w-[40%] h-screen sticky top-0 overflow-hidden">
                <MonacoEditor />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Videos;
