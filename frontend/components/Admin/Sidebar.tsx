'use client'
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
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { User2, ChevronUp } from "lucide-react";
import { useUser } from "@/context/UserContext";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
// Menu items.
const listItems = [
  {
    title: "User",
    url: "/admin/list/users",
    icon: PiUserList,
  },
  {
    title: "Post",
    url: "/admin/list/posts",
    icon: BsPostcard,
  },
]

const applicationItems = [
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
]

export function AppSidebar() {
  const { username } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const handleNavigation = (url:string) => {
    router.push(url);
  }
  return (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-base font-bold mt-5"><CiViewList className="mr-2"/>List</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {listItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
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
            <SidebarGroupLabel className="text-base font-bold"><LuActivity className="mr-2"/>Statistics</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {applicationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
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
        <SidebarFooter>
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
                    className="w-[--radix-popper-anchor-width]"
                  >
                    <DropdownMenuItem>
                      <span className="w-55">Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
      </Sidebar>
    </>
  )
}
