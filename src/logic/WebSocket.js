import {io} from "socket.io-client";

const webSocketBackendUrl = "http://192.168.0.223:5001"

export const socket = io(
    webSocketBackendUrl,
    {
        transports: ['websocket'],
        // autoConnect: true
    }
    );