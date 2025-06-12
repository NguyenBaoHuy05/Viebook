"use client";
import { IoMdHome } from "react-icons/io";
import { IoPeople } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { IoMdNotifications } from "react-icons/io";
import { FaFacebook } from "react-icons/fa";
import Logout from "./Button/Logout";
import { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PopoverNotifycation from "./PopoverNotifycation";
import ImageWithSkeleton from "./SideBar/image";
import axios from "@/lib/axiosConfig";
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
import { RiAccountCircleLine } from "react-icons/ri";
import iUser from "@/interface/userType";
function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSetting, setIsSetting] = useState(false);
  const { username, setUsername, avatar } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<iUser[]>([]);
  const commandInputRef = useRef<HTMLInputElement>(null);
  const commandRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchTerm === "") {
      setResults([]);
      return;
    }

    const fetch = async () => {
      const res = await axios.get("/api/searchUsers", {
        params: { q: searchTerm },
      });
      setResults(res.data.users);
    };

    fetch();
  }, [searchTerm]);
  const handleFocus = () => {
    setTimeout(() => {
      if (!commandRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
      }
    }, 100);
  };
  return (
    <>
      <div className="mx-auto grid grid-cols-7 py-3 px-5 border-2 bg-white fixed w-screen right-0 top-0 z-3">
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
        </div>
        <div className="col-span-5 flex justify-center items-center gap-12">
          <Link href="/home">
            <IoMdHome
              size={32}
              className="cursor-pointer transition-transform hover:scale-130"
            />
          </Link>
          <Link href="/people">
            <IoPeople
              size={32}
              className="cursor-pointer transition-transform hover:scale-130"
            />
          </Link>
          <Link href={`/account/${username}`}>
            <CgProfile
              size={32}
              className="cursor-pointer transition-transform hover:scale-130"
            />
          </Link>
        </div>

        <div className="z-50 col-span-1 relative flex justify-end items-center gap-4">
          <Link href="/save">
            <svg
              width="24"
              height="24"
              // fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="text-2xl"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
            </svg>
          </Link>
          <PopoverNotifycation />
          <Popover>
            <PopoverTrigger asChild>
              <div onClick={() => setIsSetting(!isSetting)}>
                <ImageWithSkeleton
                  src={avatar ?? "https://github.com/shadcn.png"}
                  alt="demo"
                  className="w-8 h-8 hover:scale-130 transition-transform hover:cursor-pointer"
                  imgClass="rounded-full"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-40 mr-10">
              <div>
                <Logout />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Command
        ref={commandRef}
        className="z-50 fixed h-fit top-4.5 ml-5 w-1/6 rounded-lg border shadow-md"
      >
        <CommandInput
          ref={commandInputRef}
          placeholder="Search..."
          onFocus={() => setIsOpen(true)}
          onBlur={handleFocus}
          onValueChange={(value) => setSearchTerm(value)}
        />
        {isOpen && (
          <CommandList>
            <CommandGroup heading="Users">
              {results.length !== 0 ? (
                results.map((res) => (
                  <CommandItem key={res.id} value={res.username}>
                    <ImageWithSkeleton
                      src={
                        res.profile_picture ?? "https://github.com/shadcn.png"
                      }
                      alt="demo"
                      className="w-8 h-8"
                      imgClass="rounded-full"
                    />
                    <span>{res.username}</span>
                    <CommandShortcut onClick={() => setIsOpen(false)}>
                      <Link href={`/account/${res.username}`}>
                        <RiAccountCircleLine />
                      </Link>
                    </CommandShortcut>
                  </CommandItem>
                ))
              ) : (
                <CommandItem>Không tìm thấy thông tin</CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </>
  );
}

export default Header;
