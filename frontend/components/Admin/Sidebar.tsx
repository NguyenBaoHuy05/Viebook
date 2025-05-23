"use client";
import { CiViewList } from "react-icons/ci";
import { FaUsers } from "react-icons/fa";
import { LuActivity } from "react-icons/lu";
import { BsPostcard } from "react-icons/bs";
import { PiUserList } from "react-icons/pi";
import { TbReportAnalytics } from "react-icons/tb";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import Logout from "../Button/Logout";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { User2, ChevronUp } from "lucide-react";
import { useUser } from "@/context/UserContext";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/logo/logo";
// Menu items.
const listItems = [
  {
    title: "ManageUser",
    url: "/admin/list/users",
    icon: PiUserList,
  },
  {
    title: "ManagePost",
    url: "/admin/list/posts",
    icon: BsPostcard,
  },
];

const applicationItems = [
  {
    title: "Overview",
    url: "/admin/statictis/overview",
    icon: FaUsers,
  },
  {
    title: "User",
    url: "/admin/statictis/users",
    icon: FaUsers,
  },
  {
    title: "Post",
    url: "/admin/statictis/posts",
    icon: TbReportAnalytics,
  },
];

export function AppSidebar() {
  const { username } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string>("");
  const handleNavigation = (url: string) => {
    router.push(url);
  };
  return (
    <>
      <Sidebar className="text-white">
        <SidebarContent className="bg-gray-800">
          <SidebarGroup className="">
            <SidebarGroupLabel className="text-white text-2xl font-bold mt-5">
              <CiViewList className="mr-2" />
              List
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {listItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => setOpen(item.title)}
                      asChild
                      className={`${
                        open === item.title
                          ? "bg-gray-700 text-white hover:bg-gray-600 hover:text-white"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      <button onClick={() => handleNavigation(item.url)}>
                        <item.icon />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel className="text-white text-xl font-bold mt-5">
              <LuActivity className="mr-2" />
              Statistics
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {applicationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => setOpen(item.title)}
                      asChild
                      className={`${
                        open === item.title
                          ? "bg-gray-700 text-white hover:bg-gray-600 hover:text-white"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      <button onClick={() => handleNavigation(item.url)}>
                        <item.icon />
                        <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="bg-gray-900">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> {username}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width] hover:cursor-pointer hover:bg-gray-200"
                >
                  <DropdownMenuItem>
                    <Logout />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
