import clientPromise from "@/client/mongo";
import { ObjectId, WithId, Document } from "mongodb";
import { notFound } from "next/navigation";
import * as React from "react";

interface PostDetailProps {
  params: { postId: string };
}

interface Post extends WithId<Document> {
  title: string;
  keywords: string;
  postContent: string;
  metaDescription: string;
  userId: ObjectId;
  topic: string;
}

async function fetchPost(postId: string) {
  const client = await clientPromise;
  let objId: ObjectId;
  try {
    objId = new ObjectId(postId);
  } catch (e) {
    return notFound();
  }
  const post = (await client
    .db()
    .collection("posts")
    .findOne({ _id: objId })) as Post | null;
  if (!post) {
    return notFound();
  }
  return post;
}

const PostDetail: React.FC<PostDetailProps> = async ({
  params: { postId },
}) => {
  const post = await fetchPost(postId);
  return (
    <div>
      <div>Post Detail page: {postId}</div>
      <div>{post.title}</div>
      <div>{post.metaDescription}</div>
      <div>{post.postContent}</div>
    </div>
  );
};

export default PostDetail;
