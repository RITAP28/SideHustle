import { FaPlay } from "react-icons/fa";
import { IoPlayBack } from "react-icons/io5";
import { IoPlayForward } from "react-icons/io5";
import { FaPause } from "react-icons/fa";
import { useRef, useState } from "react";
import { IoIosSettings } from "react-icons/io";
import { MdFullscreen } from "react-icons/md";
// import { MdFullscreenExit } from "react-icons/md";

function Videos() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

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

  return (
    <>
    
    <div className="w-[60rem]">
      <video
        src="/testVideo1.mp4"
        controls={false}
        className="w-full"
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetaData}
      >
        <source type="video/mp4" src="/testVideo1.mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="flex flex-row w-full">
        <div className="basis-3/10 flex flex-row">
          <div className="basis-1/3 mr-2">
            <IoPlayBack />
          </div>
          <div className="basis-1/3 mx-2">
            {(duration === 0) ? (
                <button type="button" className="" onClick={() => {
                    if(videoRef.current !== null){
                        videoRef.current.play();
                        setIsPlaying(true);
                    }
                }}>
                    <FaPause />
                </button>
            ) : (
                <button type="button" className="" onClick={togglePlayPause}>
                    {isPlaying ? <FaPlay /> : <FaPause />}
                </button>
            )}
          </div>
          <div className="basis-1/3 mx-2">
            <IoPlayForward />
          </div>
        </div>
        <div className="basis-5/10 w-full mx-4">
          <input
            type="range"
            className="w-full"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
          />
        </div>
        <div className="basis-1/10 mx-3">
            <IoIosSettings />
        </div>
        <div className="basis-1/10 ml-3 mr-2">
            <MdFullscreen />
        </div>
      </div>
    </div>
    </>
  );
}

export default Videos;
