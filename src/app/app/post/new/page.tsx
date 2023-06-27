"use client";
import * as React from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter, redirect } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";

interface Post {
  postContent: string;
  title: string;
  metaDescription: string;
}

const NewPostPage: React.FC = () => {
  const { user, isLoading } = useUser();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const router = useRouter();
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

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, keywords, uid: user.sub }),
      });
      const json = await response.json();
      console.log("json: ", json);
      if (json?.post?._id) {
        router.push(`/app/post/${json.post._id}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {isGenerating && (
        <div className="text-green-500 flex w-full h-full flex-col animate-pulse items-center justify-center">
          <FontAwesomeIcon
            icon={faBrain}
            width={100}
            height={100}
            className="text-6xl"
          />
          <h6>Generating...</h6>
        </div>
      )}
      {!isGenerating && (
        <div className="flex w-full h-full flex-col overflow-auto">
          <form
            onSubmit={onSubmit}
            className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200"
          >
            <div>
              <label htmlFor="topic">
                <b>Generate a blog post on the topic of:</b>
              </label>
              <textarea
                className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                defaultValue="Top 10 tips for dog owners"
                name="topic"
                id="topic"
                required
                minLength={5}
                maxLength={200}
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
                required
                minLength={5}
                maxLength={200}
              />
            </div>
            <small className="block mb-2">Separate keywords with comma</small>
            <button type="submit" className="btn">
              Generate
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default NewPostPage;
