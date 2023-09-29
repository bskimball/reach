import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import io from "socket.io-client";
import socketio from "@feathersjs/socketio-client";
import rest from "@feathersjs/rest-client";
import { createClient } from "backend";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

console.log(import.meta.env.VITE_BASE_URL);

export const socketClient = createClient(
  socketio(io(import.meta.env.VITE_BASE_URL || "http://localhost:3030"))
);

export const restClient = createClient(
  rest(import.meta.env.VITE_BASE_URL || "http://localhost:3030").fetch(
    window.fetch.bind(window)
  )
);
