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
  const userProfile = await client
    .db()
    .collection("users")
    .updateOne(
      {
        auth0Id: user.sub,
      },
      {
        $inc: {
          availableTokens: 10,
        },
        $setOnInsert: {
          auth0Id: user.sub,
        },
      },
      {
        upsert: true,
      }
    );
  res.status(200).json({ message: "ok", userProfile });
}
