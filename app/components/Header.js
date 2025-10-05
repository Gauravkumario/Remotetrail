"use client";

import Link from "next/link";
import { FaLinkedin, FaSignOutAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated =
        sessionStorage.getItem("isAdminAuthenticated") === "true";
      setIsAdmin(isAuthenticated);
    };

    checkAuth();

    // Listen for changes in sessionStorage
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [pathname]); // Re-check on route change

  const handleLogout = () => {
    sessionStorage.removeItem("isAdminAuthenticated");
    setIsAdmin(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#111827]/80 backdrop-blur-sm border-b border-[#1f2937]">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo and Brand */}
          <Link
            href="/"
            className="flex items-center space-x-2 md:space-x-3 group"
          >
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-[#f3f4f6] to-[#3b82f6] inline-block text-transparent bg-clip-text">
              RemoteTrail
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-4 md:space-x-6">
            <Link
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaLinkedin className="h-6 w-6" />
            </Link>
            {isAdmin && (
              <button
                onClick={handleLogout}
                aria-label="Logout"
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <FaSignOutAlt className="h-6 w-6" />
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
