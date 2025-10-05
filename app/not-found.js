"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page after a brief delay
    const redirectTimeout = setTimeout(() => {
      router.push("/");
    }, 2000); // 2 seconds delay before redirect

    // Cleanup timeout if component unmounts
    return () => clearTimeout(redirectTimeout);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#111827] px-4">
      <h1 className="text-4xl font-bold text-[#f3f4f6] mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-[#4b5563] mb-8">
        Redirecting you to the home page...
      </p>
      <div className="animate-pulse">
        <div className="h-2 w-24 bg-[#3b82f6] rounded"></div>
      </div>
    </div>
  );
}
