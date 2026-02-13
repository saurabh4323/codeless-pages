"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuperAdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/superadmin/tokens");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f1023]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
