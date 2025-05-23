import type { Metadata } from "next";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Header from "@/components/Header";

import { UserProvider } from "@/context/UserContext";
export const metadata: Metadata = {
  title: "Viebook",
  description: "Mạng xã hội cho người Việt",
};

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="antialiased">
      <UserProvider>
        <ProtectedRoute>{children}</ProtectedRoute>
      </UserProvider>
    </div>
  );
}
