"use client";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";

export default function UserInfo() {
  const { user, isLoading } = useUser();
  return (
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
            <Link className="text-sm" href="/api/auth/logout" prefetch={false}>
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
  );
}
