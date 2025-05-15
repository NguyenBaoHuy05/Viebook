import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Admin/Sidebar";
import React from "react";

import Logo from "@/logo/logo";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="bg-gray-100">
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
        {/* <div className="absolute right-5 top-5">{Logo(50, 50)}</div> */}
      </main>
    </SidebarProvider>
  );
}
