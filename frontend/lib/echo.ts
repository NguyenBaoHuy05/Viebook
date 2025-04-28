"use client";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Extend the Window interface to include Pusher
declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "reverb",
  key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
  wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || window.location.hostname,
  wsPort: process.env.NEXT_PUBLIC_REVERB_PORT || 6001,
  wssPort: process.env.NEXT_PUBLIC_REVERB_PORT || 6001,
  forceTLS: false,
  encrypted: true,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
  authEndpoint: `${process.env.NEXT_PUBLIC_API_BASE_URL}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, //
      Accept: "application/json",
    },
  },
});

export default echo;
