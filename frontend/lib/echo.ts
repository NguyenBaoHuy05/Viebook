"use client";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

window.Pusher = Pusher;

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const echo = new Echo({
  broadcaster: "reverb",
  key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || "pbjtbqkgods0xbxtp81y",
  wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || "localhost",
  wsPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || "8080"),
  wssPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || "8080"),
  forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME || "http") === "https",
  enabledTransports: ["ws"],
  authEndpoint: "/broadcasting/auth",
  auth: {
    headers: {
      Accept: "application/json",
      "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
    },
  },
  withCredentials: true,
});

export default echo;
