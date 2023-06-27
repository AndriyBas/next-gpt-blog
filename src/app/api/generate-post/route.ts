import clientPromise from "@/client/mongo";
import { NextResponse, NextRequest } from "next/server";
import { Configuration, OpenAIApi } from "openai";

export async function POST(request: NextRequest) {
  const {
    topic,
    keywords,
    uid,
  }: { topic?: string; keywords?: string; uid?: string } = await request.json();
  if (!topic || !keywords || !uid) {
    return NextResponse.json(
      { message: "Bad request. topic, keywords, uid are required" },
      { status: 401 }
    );
  }

  const client = await clientPromise;
  const user = await client.db().collection("users").findOne({ auth0Id: uid });
  if (!user?.availableTokens) {
    return NextResponse.json(
      {
        message: "Not authorized. User doesn't exist or not enough tokens",
      },
      { status: 403 }
    );
  }

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openAI = new OpenAIApi(config);
  // const response = await openAI.createCompletion({
  //   model: "text-davinci-003",
  //   temperature: 0,
  //   max_tokens: 3600,
  //   prompt: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separateed keywords: ${keywords}.
  //   The content should be formatted in SEO-friendly HTML.
  //   The response must also include appropirate HTML title and meta description content.
  //   The return format must be stringified JSON in the following format:
  //   {
  //     "postContent": post content here
  //     "title": title goes here
  //     "metaDescription": meta description goes here
  //   }
  //   `,
  // });

  const systemMsg =
    "You are a SEO-friendly blog post generator, that generates HTML-formatted blog posts";
  const mainPrompt = `Write a long and detailed SEO-friendly blog post about '${topic}', that targets the following comma-separateed keywords: ${keywords}.
        The content must be formatted in SEO-friendly HTML, limited ONLY to the following HTML tags: <p>, <h1>, <h2>, <h3>, <h4>, <h5>, <h6>, <li>, <ol>, <ul>, <i>, <b>, <strong>, <pre>, <code>. Do not generate <head> and <body> tags.`;

  const setupMessages = [
    {
      role: "system",
      content: "",
    },
    {
      role: "user",
      content: mainPrompt,
    },
  ];
  const postContentResponse = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: systemMsg,
      },
      {
        role: "user",
        content: mainPrompt,
      },
    ],
  });

  const postContent =
    postContentResponse.data?.choices?.[0]?.message?.content ?? "";

  const titleResponse = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: systemMsg,
      },
      {
        role: "user",
        content: mainPrompt,
      },
      {
        role: "assistant",
        content: postContent,
      },
      {
        role: "user",
        content:
          "Generate appropriate title tag text for the above blog post. Don't include quotes around the title",
      },
    ],
  });

  const metaDescrResponse = await openAI.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: systemMsg,
      },
      {
        role: "user",
        content: mainPrompt,
      },
      {
        role: "assistant",
        content: postContent,
      },
      {
        role: "user",
        content:
          "Generate SEO-friendly meta description content for the above blog post",
      },
    ],
  });

  const title = titleResponse.data?.choices?.[0]?.message?.content ?? "";
  const metaDescription =
    metaDescrResponse.data?.choices?.[0]?.message?.content ?? "";

  // decrement user tokens
  await client
    .db()
    .collection("users")
    .updateOne(
      { auth0Id: uid },
      {
        $inc: {
          availableTokens: -1,
        },
      }
    );

  // console.log("postContent: ", postContent);
  // console.log("title: ", title);
  // console.log("metaDescription: ", metaDescription);

  const post = {
    title,
    postContent: postContent.replaceAll("\n", ""),
    metaDescription,
    topic,
    keywords,
    userId: user._id,
    createdAt: new Date(),
  };

  await client.db().collection("posts").insertOne(post);

  console.log("post: ", post);
  return NextResponse.json({ message: "ok", post });
}
