"use client";
import * as React from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { Logo } from "@/components/Logo";
import { Post } from "@/data/Post";
import { usePathname } from "next/navigation";

interface Data {
  availableTokens: number;
  posts: Post[];
}

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, isLoading } = useUser();
  const [data, setData] = React.useState<Data | null>(null);
  const path = usePathname();
  const postId = path?.split("/").pop() ?? "";

  console.log("postId:", postId);

  React.useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => {
        console.log(d);
        setData(d);
      });
  }, []);

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden">
        <div className="bg-slate-800 px-2">
          <Logo />
          <Link className="btn" href="/app/post/new">
            New post
          </Link>
          <Link className="block mt-2 text-center" href="/app/token-topup">
            <FontAwesomeIcon
              icon={faCoins}
              className="text-yellow-500"
              width={16}
              height={16}
            />
            <span className="pl-1">
              {data?.availableTokens ?? 0} tokens available
            </span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800 px-4">
          {data?.posts?.length &&
            data.posts.map((p) => (
              <Link
                href={`/app/post/${p._id}`}
                key={p._id}
                className={`py-1 border block text-ellipsis overflow-hidden whitespace-nowrap my-1 px-2 bg-white/10 cursor-pointer rounded-sm ${
                  postId === p._id
                    ? " bg-white/20 border-white"
                    : " border-transparent"
                }`}
              >
                {p.topic}
              </Link>
            ))}
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
      {user ? (
        children
      ) : (
        <p className="w-full text-center p-10">
          {isLoading ? "Loading ..." : "Please, log in"}
        </p>
      )}
    </div>
  );
}
