"use client";
import { IoMdHome } from "react-icons/io";
import { IoPeople } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { IoMdNotifications } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { FaFacebook } from "react-icons/fa";
import Logout from "./Button/Logout";
function Header() {
  return (
    <>
      <div>
        <div className="grid grid-cols-5 py-3 px-5 border-2 bg-white fixed w-screen right-0 top-0 z-50">
          <div className="col-span-1 mt-auto ml-1 flex gap-5 items-center">
            <FaFacebook
              size={50}
              className="cursor-pointer transition-transform hover:scale-130"
            />
            <Input placeholder="Tìm kiếm" />
          </div>
          <div className="col-span-3 flex justify-center items-center gap-30">
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
          <div className="col-span-1 relative flex items-center">
            <CgProfile
              size={40}
              className="absolute right-0 cursor-pointer transition-transform hover:scale-130"
            />
            <Logout />
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
