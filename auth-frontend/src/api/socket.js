import {io} from 'socket.io-client';
import {getAccessToken} from "../auth/tokenService.js";

export const socket = io('http://localhost:3000/', {
    autoConnect: false,
    auth: {
        token: getAccessToken(),
    },
});