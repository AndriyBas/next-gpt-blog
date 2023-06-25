"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";
import * as React from "react";

const NewPage: React.FC = () => {
  const { user, isLoading } = useUser();
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (!user) {
    redirect("/");
  }

  return <div>New page</div>;
};

export default NewPage;
