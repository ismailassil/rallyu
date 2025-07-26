'use client'
import { useEffect, useState } from "react";


const Page = function () {
    const [socket, setSocket] = useState<WebSocket>();
    
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:3002/api/v1/matchmaking/join");
        console.log(ws.url);
        
        ws.onopen = () => {
            console.log('Connected to websocket!');
            ws.send('Hello, Webscoket!');
        }

        ws.onmessage = (message) => {
            console.log(message);
            console.log(message.data)
        }

        ws.onclose = () => {
            console.log("Websocket connection closed!")
        }

        setSocket(ws);

        return () => {
            ws.close();
        }
    }, [])

    return (
        <div>
            <button onClick={() => socket?.send("Hi players")}>Click</button>
        </div>
    )
}

export default Page;