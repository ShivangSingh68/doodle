let ws: WebSocket | null;

export const getWs = () => {
    if(!ws) {
        ws = new WebSocket("ws://localhost:8080");
    }
    return ws;
}