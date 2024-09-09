import { io } from 'socket.io-client';

const URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3333";

export const IoConnection = io(URL,{
    autoConnect:false
});