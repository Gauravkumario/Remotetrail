"use client";
import Link from "next/link";
import { useState } from "react";
import { FaTwitter, FaGithub, FaLinkedin, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubscribe = (e) => {
    e.preventDefault();
    setError("");
    setSubscribed(false);

    if (email.trim().toLowerCase() === "admin-access") {
      sessionStorage.setItem("isAdminAuthenticated", "true");
      router.push("/admin");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      // Handle actual subscription logic here (e.g., API call)
      console.log("Subscribed with:", email);
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    } else {
      setError("Please enter a valid email address.");
    }
  };

  return (
    <footer className="border-t border-[#1f2937] bg-[#111827]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-bold bg-gradient-to-r from-[#f3f4f6] to-[#3b82f6] inline-block text-transparent bg-clip-text">
              RemoteTrail
            </h2>
            <p className="mt-1 text-sm text-[#9CA3AF]">
              Curated remote jobs for builders.
            </p>
          </div>
          <div className="w-64 sm:max-w-xs">
            <form onSubmit={handleSubscribe} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full rounded-lg border border-[#374151] bg-[#1f2937] px-4 py-2.5 pr-12 text-white focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 transition-all"
                  required
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-[#3b82f6] p-1.5 text-white transition hover:bg-[#2563eb]"
                >
                  <FaArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
            <p className="mt-2 text-xs text-gray-500">
              Your inbox&apos;s new favorite email. Maybe.
            </p>
            {subscribed && (
              <p className="mt-2 text-sm text-green-400">
                Thank you for subscribing!
              </p>
            )}
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </div>
        </div>
        <div className="mt-8 border-t border-[#1f2937] pt-8 flex items-center justify-between">
          <p className="text-sm text-[#9CA3AF]">
            &copy; {new Date().getFullYear()} RemoteTrail. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              href="https://twitter.com"
              className="text-[#9CA3AF] hover:text-[#3b82f6] transition-colors"
            >
              <FaTwitter className="h-5 w-5" />
            </Link>
            <Link
              href="https://github.com"
              className="text-[#9CA3AF] hover:text-[#3b82f6] transition-colors"
            >
              <FaGithub className="h-5 w-5" />
            </Link>
            <Link
              href="https://linkedin.com"
              className="text-[#9CA3AF] hover:text-[#3b82f6] transition-colors"
            >
              <FaLinkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
