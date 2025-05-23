'use client'
import { useEffect, useState } from "react";

const Page = function () {
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:3001/lol");

        console.log(ws.url);

        ws.onopen = () => {
            console.log('Connected to websocket!');
            ws.send('Hello, Webscoket!');
        }

        ws.onclose = () => {
            console.log("Websocket connection closed!")
        }

        return () => {
            ws.close();
        }
    }, [])

    return <h1>Hi</h1>
}

export default Page;