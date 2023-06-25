"use client";
import * as React from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";

const AuthPage: React.FC = () => {
  const { user, isLoading } = useUser();
  console.log("user: ", user);
  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div>
      <div>
        {!!user ? (
          <>
            <div>
              <Image
                src={user.picture ?? ""}
                alt={user.name ?? ""}
                width={100}
                height={100}
              />
              <p>{user.email}</p>
            </div>
            <Link href="/api/auth/logout">Log out</Link>
          </>
        ) : (
          <>
            <Link href="/api/auth/login">Log in</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
