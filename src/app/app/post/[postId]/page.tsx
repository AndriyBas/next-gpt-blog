import clientPromise from "@/client/mongo";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    <div className="overflow-auto h-full">
      <div className="max-w-screen-sm mx-auto">
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          SEO title and meta description
        </div>
        <div className="p-4 my-2 border border-stone-200 rounded-md">
          <div className="text-blue-600 text-2xl font-bold">{post.title}</div>
          <div className="pt-2">{post.metaDescription}</div>
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          Keywords
        </div>
        <div className="flex flex-wrap pt-2 gap-1">
          {post.keywords.split(",").map((k) => (
            <div key={k} className="rounded-full p-2 bg-slate-800 text-white">
              <FontAwesomeIcon icon={faHashtag} width={16} height={16} /> {k}
            </div>
          ))}
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          Blog post
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.postContent }}></div>
      </div>
    </div>
  );
};

export default PostDetail;
