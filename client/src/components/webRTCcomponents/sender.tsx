import { useEffect, useRef, useState } from "react";

const Sender = () => {
  const [socket, setSocket] = useState<null | WebSocket>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8081");
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: "sender" }));
    };
    setSocket(socket);
  }, []);

  async function startPlayingVideo() {
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

    getVideoAndAudio(pc);
  }

  const getVideoAndAudio = async (pc: RTCPeerConnection) => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    pc.addTrack(stream.getVideoTracks()[0]);
    if(videoRef.current){
        videoRef.current.srcObject = stream;
    }
  };

  return (
    <>
      <div className="">
        <button type="button" className="" onClick={startPlayingVideo}>
          Play Video
        </button>
      </div>
      <div className="">
        <video ref={videoRef} autoPlay playsInline />
      </div>
    </>
  );
};

export default Sender;
