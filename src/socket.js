

import { io } from "socket.io-client";
import BASE_URL from "../api";

let socket;

export const connectSocket = (userId) => {
  if (!socket) {
    socket = io(`${BASE_URL}`, {
      withCredentials: true,
    });

    socket.on("connect", () => {
     // console.log("✅ Connected:", socket.id);

      if (userId) {
        socket.emit("joinRoom", userId);
        //console.log("📌 Joined room:", userId);
      }
    });
  }

  return socket;
};

export const getSocket = () => socket;