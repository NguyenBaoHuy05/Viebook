import type { Metadata } from "next";
import "../../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import PopoverChat from "@/components/PopoverChat";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="antialiased px-15">
      <Header />
      {children}
      <PopoverChat />
    </div>
  );
}
