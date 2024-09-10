import { io } from 'socket.io-client';

const URL = process.env.NEXT_PUBLIC_BASE_URL;
console.log(URL)
export const IoConnection = io(URL,{
    autoConnect:false
});