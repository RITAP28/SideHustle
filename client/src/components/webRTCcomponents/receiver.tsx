import { useEffect, useRef } from "react";

const Receiver = () => {
  // const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  let pc: RTCPeerConnection | null = null;

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8081");
    socket.onopen = () => {
        console.log('WebSocket connection established');
      socket.send(
        JSON.stringify({
          type: "receiver",
        })
      );
    };
    // VideoStreaming(socket);

    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      if(message.type === 'createOffer'){
        pc = new RTCPeerConnection();
        pc.setRemoteDescription(new RTCSessionDescription(message.sdp));

        pc.onicecandidate = (event) => {
          console.log(event);
          if(event.candidate){
            socket.send(JSON.stringify({
              type: 'iceCandidate',
              candidate: event.candidate
            }));
          }
        };

        pc.ontrack = (track) => {
          console.log(track);
          if(videoRef.current){
            videoRef.current.srcObject = new MediaStream([event.data]);
            videoRef.current.play();
          }
        };


        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.send(JSON.stringify({
          type: 'createAnswer',
          sdp: pc.localDescription
        }));
      } else if(message.type === 'iceCandidate'){
        if(pc !== null){
          pc.addIceCandidate(new RTCIceCandidate(message.candidate));
        }
      }
    }

    socket.onerror = (event) => {
      console.error(`Websocket error: ${event}`);
    };

  }, []);

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
