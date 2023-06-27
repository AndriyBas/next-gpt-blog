import clientPromise from "@/client/mongo";
import { getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req, res);
  if (!session?.user) {
    return res.status(401).json({ message: "Not authorized, no session" });
  }
  const { user } = session;
  console.log("user: ", user);

  const client = await clientPromise;
  const mongoUser = await client.db().collection("users").findOne({
    auth0Id: user.sub,
  });
  if (!mongoUser) {
    return res.status(200).json({ availableTokens: 0, posts: [] });
  }
  const posts = await client
    .db()
    .collection("posts")
    .find({ userId: mongoUser._id })
    .toArray();

  return res
    .status(200)
    .json({ availableTokens: mongoUser.availableTokens, posts });
}
