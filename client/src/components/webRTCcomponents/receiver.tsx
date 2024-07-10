import { useEffect } from 'react'

const Receiver = () => {
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8081');
        socket.onopen = () => {
            socket.send(JSON.stringify({
                type: 'receiver',
            }));
        };

        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            const pc2 = new RTCPeerConnection();
            if(message.type === 'createOffer'){
                // create an answer
                pc2.setRemoteDescription(message.sdp);

                pc2.onicecandidate = (event) => {
                    console.log(event);
                    if(event.candidate){
                        socket?.send(JSON.stringify({
                            type: 'iceCandidate',
                            candidate: event.candidate
                        }));
                    }
                };

                pc2.ontrack = (track) => {
                    console.log(track);
                };

                const answer = await pc2.createAnswer();
                pc2.setLocalDescription(answer);
                socket?.send(JSON.stringify({
                    type: 'createAnswer',
                    sdp: pc2.remoteDescription
                }));
            } else if(message.type === 'iceCandidate'){
                 pc2.addIceCandidate(message.candidate);
            }
        };
    }, []);


  return (
    <div>receiver</div>
  )
}

export default Receiver