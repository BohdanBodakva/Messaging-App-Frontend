import {io} from "socket.io-client";

export const webSocketBackendUrl = "http://192.168.0.104:5001"
// export const webSocketBackendUrl = "http://127.0.0.1:5000"

export const socket = io(
    webSocketBackendUrl,
    { transports: ['websocket'] }
    );
