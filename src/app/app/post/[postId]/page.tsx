"use client";
import * as React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";

interface PostDetailProps {
  params: { postId: string };
}

const PostDetail: React.FC<PostDetailProps> = ({ params: { postId } }) => {
  const { user, isLoading } = useUser();
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (!user) {
    redirect("/");
  }
  return <div>Post Detail page: {postId}</div>;
};

export default PostDetail;
