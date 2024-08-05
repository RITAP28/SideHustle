import { Terminal as XTerminal } from "@xterm/xterm";
import { useEffect, useRef } from "react";
import '@xterm/xterm/css/xterm.css';
import socket from '../../../utils/socket';

const Terminal = () => {
    const terminalRef = useRef<HTMLDivElement>(null);
    const isRendered = useRef<boolean>(false);
    // const [buffer, setBuffer] = useState<string>('');
    const buffer = useRef<string>('');
  useEffect(() => {
    if(isRendered.current) return;
    isRendered.current = true;

    const term = new XTerminal({
        rows: 14
    });
    if(terminalRef.current !== null){
        term.open(terminalRef.current);
    }

    term.onData((data) => {
        if(data === '\r' || data === '\n'){
            socket.send(buffer.current);
            // setBuffer('');
            buffer.current = '';
        } else if(data === '\x7f') {
            buffer.current = buffer.current.slice(0, -1);
        } else {
            buffer.current += data;
        }
        term.write(data);
    });

    socket.onmessage = (event) => {
        term.write(event.data);
    };

    socket.onerror = (error) => {
        console.error('Error while connecting to socket: ', error);
    };

    socket.onclose = () => {
        console.log('Socket connection closed');
    };

  }, [buffer]);
  return (
    <div ref={terminalRef} className="w-full h-full"></div>
  )
};

export default Terminal;
