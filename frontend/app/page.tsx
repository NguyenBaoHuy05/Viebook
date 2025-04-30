"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Đang xử lý...</span>
      </div>
    </div>
  );
}
