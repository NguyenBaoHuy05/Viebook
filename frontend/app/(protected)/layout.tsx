import type { Metadata } from "next";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Chat from "@/components/Chat";
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
    <div className="antialiased px-15">
      <UserProvider>
        <ProtectedRoute>
          <Header />
          {children}
          <Chat />
        </ProtectedRoute>
      </UserProvider>

      <Toaster richColors position="bottom-right" />
    </div>
  );
}
