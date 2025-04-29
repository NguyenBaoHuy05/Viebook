"use client";
import { IoMdHome } from "react-icons/io";
import { IoPeople } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { IoMdNotifications } from "react-icons/io";
import { FaFacebook } from "react-icons/fa";
import Logout from "./Button/Logout";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSetting, setIsSetting] = useState(false);
  return (
    <>
      <div className="relative">
        <div className=" grid grid-cols-7 py-3 px-5 border-2 bg-white fixed w-screen right-0 top-0 z-3">
          <div className="col-span-1 flex justify-start items-center gap-4">
            <svg
              width="45"
              height="45"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              className="cursor-pointer transition-transform hover:scale-100 rounded-full"
            >
              <circle cx="32" cy="32" r="32" fill="black" />

              <path
                d="M20 24 L32 40 L44 24"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 15 q2 5 6 0 q2 -4 4 0"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M50 15 q3 5 6 0 q3 -5 6 0"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M15 50 q2 3 4 0 q2 -3 4 0"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M40 45 q3 3 4 0 q3 -5 6 0"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>

            {!isOpen && (
              <div className="rounded-full bg-gray-200 p-2 flex items-center gap-2">
                <FaSearch
                  size={20}
                  onClick={() => setIsOpen(!isOpen)}
                  className="cursor-pointer transition-transform hover:scale-100"
                />
              </div>
            )}
          </div>
          <div className="col-span-5 flex justify-center items-center gap-12">
            <IoMdHome
              size={32}
              className="cursor-pointer transition-transform hover:scale-130"
            />
            <IoPeople
              size={32}
              className="cursor-pointer transition-transform hover:scale-130"
            />
            <CgProfile
              size={32}
              className="cursor-pointer transition-transform hover:scale-130"
            />
            <IoMdNotifications
              size={32}
              className="cursor-pointer transition-transform hover:scale-130"
            />
          </div>

          <div className="col-span-1 relative flex justify-end items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <FiSettings
                  onClick={() => setIsSetting(!isSetting)}
                  size={25}
                  className={`${
                    isSetting ? "rotate-90" : ""
                  } cursor-pointer transition-transform hover:scale-130`}
                />
              </PopoverTrigger>
              <PopoverContent className="w-40 mr-10">
                <div className="grid gap-4">
                  <Logout />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      {isOpen && (
        <Command
          onClick={() => setIsOpen(!isOpen)}
          className="z-4 absolute h-fit top-4.5 ml-5 w-1/6 rounded-lg border shadow-md"
        >
          <CommandInput placeholder="Search..." />
          <CommandList></CommandList>
        </Command>
      )}
    </>
  );
}

export default Header;
