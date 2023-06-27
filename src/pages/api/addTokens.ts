import clientPromise from "@/client/mongo";
import { getSession } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

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

  const lineItems = [
    {
      price: process.env.STRIPE_PRODUCT_PRICE_ID ?? "",
      quantity: 1,
    },
  ];

  const protocol =
    process.env.NODE_ENV === "development" ? "http://" : "https://";
  const host = req.headers.host;

  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: `${protocol}${host}/app/success`,
    cancel_url: `${protocol}${host}/app/token-topup`,
    payment_intent_data: {
      metadata: {
        sub: user.sub,
      },
    },
    metadata: {
      sub: user.sub,
    },
  });

  // const client = await clientPromise;
  // const userProfile = await client
  //   .db()
  //   .collection("users")
  //   .updateOne(
  //     {
  //       auth0Id: user.sub,
  //     },
  //     {
  //       $inc: {
  //         availableTokens: 10,
  //       },
  //       $setOnInsert: {
  //         auth0Id: user.sub,
  //       },
  //     },
  //     {
  //       upsert: true,
  //     }
  //   );
  res.status(200).json({ message: "ok", session: checkoutSession });
}
