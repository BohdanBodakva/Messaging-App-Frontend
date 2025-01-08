import {io} from "socket.io-client";

export const webSocketBackendUrl = "http://192.168.0.104:5001"

export const socket = io(
    webSocketBackendUrl,
    { transports: ['websocket'] }
    );
