import { useEffect, useRef, useState } from "react";

const Sender = () => {
  const [socket, setSocket] = useState<null | WebSocket>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8081");
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "sender" }));
    };
    setSocket(socket);
  }, []);

  async function liveStreamingVideo() {
    if(!socket) return;
    const pc = new RTCPeerConnection();
    // create an offer
    pc.onnegotiationneeded = async () => {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket?.send(JSON.stringify({
            type: 'createOffer',
            sdp: pc.localDescription
        }));
    };

    pc.onicecandidate = (event) => {
        console.log(event);
        if(event.candidate){
            socket?.send(JSON.stringify({
                type: 'iceCandidate',
                candidate: event.candidate
            }));
        }
    };

    socket?.send(JSON.stringify({
        type: 'createOffer',
        sdp: pc.localDescription
    }));

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if(data.type === 'createAnswer'){
            pc.setRemoteDescription(data.sdp);
        } else if(data.type === 'iceCandidate'){
            pc.addIceCandidate(data.candidate);
        }
    };

    if(isPlaying){
        stopStreaming();
        setIsPlaying(false);
    } else {
        getVideoAndAudio(pc);
        setIsPlaying(true);
    }
  }

  const getVideoAndAudio = async (pc: RTCPeerConnection) => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    pc.addTrack(stream.getVideoTracks()[0]);
    if(videoRef.current){
        videoRef.current.srcObject = stream;
    }
  };

  const stopStreaming = async () => {
    if(socket){
        socket.onclose;
    }
  };

  return (
    <>
      <div className="w-full h-full bg-red-300">
        <video ref={videoRef} className="w-full h-full object-contain aspect-video bg-slate-700" autoPlay playsInline />
      </div>
      <div className="flex justify-center pt-4">
        <button type="button" className="px-4 py-1 font-Code font-bold bg-black text-white border-2 border-white hover:bg-white hover:text-black" onClick={liveStreamingVideo}>
          {isPlaying ? "Stop Streaming" : "Go Live"}
        </button>
      </div>
    </>
  );
};

export default Sender;
