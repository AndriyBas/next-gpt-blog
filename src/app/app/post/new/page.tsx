"use client";
import * as React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { redirect } from "next/navigation";

interface Post {
  postContent: string;
  title: string;
  metaDescription: string;
}

const NewPostPage: React.FC = () => {
  const { user, isLoading } = useUser();
  const [post, setPost] = React.useState<Post | null>(null);
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (!user) {
    redirect("/");
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const els = event.currentTarget.elements;
    const topic = (els.namedItem("topic") as HTMLTextAreaElement).value.trim();
    const keywords = (
      els.namedItem("keywords") as HTMLTextAreaElement
    ).value.trim();

    const response = await fetch("/api/generate-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic, keywords, uid: user.sub }),
    });
    const json = await response.json();
    setPost(json.post);
    console.log(json);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="topic">
            <b>Generate a blog post on the topic of:</b>
          </label>
          <textarea
            className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
            defaultValue="Top 10 tips for dog owners"
            name="topic"
            id="topic"
          />
        </div>
        <div>
          <label htmlFor="keywords">
            <b>Targetting the following keywords:</b>
          </label>
          <textarea
            className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
            id="keywords"
            defaultValue="first-time dog owners, common dog health issues, best dog breeds"
            name="keywords"
          />
        </div>
        <button type="submit" className="btn">
          Generate
        </button>
      </form>
      {post && (
        <div
          className="max-w-screen-sm p-10"
          dangerouslySetInnerHTML={{ __html: post.postContent }}
        ></div>
      )}
    </div>
  );
};

export default NewPostPage;
