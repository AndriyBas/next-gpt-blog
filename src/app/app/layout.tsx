"use client";
import * as React from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { Logo } from "@/components/Logo";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser();
  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden">
        <div className="bg-slate-800 px-2">
          <Logo />
          <Link className="btn" href="/app/post/new">
            New post
          </Link>
          <Link className="block mt-2 text-center" href="/app/token-topup">
            <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
            <span className="pl-1">0 tokens available</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
          list of posts
        </div>
        <div className="bg-cyan-800 flex flex-row items-center gap-2 border-t border-t-black/50 h-20 px-2">
          {isLoading ? (
            <div>Loading...</div>
          ) : !!user ? (
            <>
              <div className="min-w-[50px]">
                <Image
                  className="rounded-full"
                  src={user.picture ?? ""}
                  alt={user.name ?? ""}
                  width={50}
                  height={50}
                />
              </div>
              <div className="flex-1">
                <div className="font-bold">{user.email}</div>
                <Link
                  className="text-sm"
                  href="/api/auth/logout"
                  prefetch={false}
                >
                  Log out
                </Link>
              </div>
            </>
          ) : (
            <>
              <Link href="/api/auth/login">Log in</Link>
            </>
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
