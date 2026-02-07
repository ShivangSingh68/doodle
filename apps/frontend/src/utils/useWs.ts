import { useEffect, useState } from "react";
import { type OutgoingMessage, type IncomingMessage } from "../../../ws/src/types/types";
import { getWs } from "./wsSingleton";

export function useWs(){
    const [lastMessage, setLastMessage] = useState<OutgoingMessage | null>(null);
    
    useEffect(() => {
        const ws = getWs();
        const onMessage = (event: MessageEvent) => {
            const msg = JSON.parse(event.data.toString()) as OutgoingMessage;
            setLastMessage(msg);
        }
        const onError = (error: Event) => {
            console.error("Websocket Error: ", error);
        }

        ws.addEventListener("message", onMessage);
        ws.addEventListener("error", onError);
        
        return () => {
            ws.removeEventListener("message", onMessage);
            ws.removeEventListener('error', onError);
        }
    },[])

    const send = (data: IncomingMessage) => {
        const ws = getWs();
        if(!ws) return;

        if(ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data))
        } else {
            ws.addEventListener("open", () => {
                ws.send(JSON.stringify(data));
            }, {once: true})
        }
    }
    
    return {send, lastMessage};
}