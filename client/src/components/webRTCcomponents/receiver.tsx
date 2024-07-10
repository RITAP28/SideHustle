import { useEffect, useRef } from "react";

const Receiver = () => {
  // const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8081");
    socket.onopen = () => {
        console.log('WebSocket connection established');
      socket.send(
        JSON.stringify({
          type: "receiver",
        })
      );
      VideoStreaming(socket);
    };

    socket.onerror = (event) => {
      console.error(`Websocket error: ${event}`);
    };

  }, []);

  const VideoStreaming = async (socket: WebSocket) => {
    if (!socket) return;

    socket.onmessage = async (event) => {
      const pc = new RTCPeerConnection();
      try {
        const data = JSON.parse(event.data);
        console.log(data);
        if (data.type === "createOffer") {
          pc.setRemoteDescription(data.sdp);

          pc.onicecandidate = (event) => {
            console.log("on ice candidate: ", event);
            if (event.candidate) {
              socket.send(
                JSON.stringify({
                  type: "iceCandidate",
                  sdp: event.candidate,
                })
              );
            }
          };

          pc.ontrack = (event) => {
            if (videoRef.current) {
              videoRef.current.srcObject = new MediaStream([event.track]);
              videoRef.current?.play();
            }
          };

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.send(
            JSON.stringify({
              type: "createAnswer",
              sdp: pc.localDescription,
            })
          );
        } else if (data.type === "iceCandidate") {
            console.log(data.candidate);
          pc.addIceCandidate(data.candidate);
        }
      } catch (error) {
        console.log("error parsing message: ", error);
      }
    };
  };

  return (
    <>
      <div className="w-full h-full bg-red-300">
        <video
          ref={videoRef}
          className="w-full h-full object-contain aspect-video bg-slate-700"
          autoPlay
          playsInline
        />
      </div>
    </>
  );
};

export default Receiver;
