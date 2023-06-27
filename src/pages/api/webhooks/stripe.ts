import Cors from "micro-cors";
import { NextApiRequest, NextApiResponse } from "next";
import StripeInit from "stripe";
import verifyStripe from "@webdeveducation/next-verify-stripe";
import clientPromise from "@/client/mongo";
import { IncomingMessage, ServerResponse } from "http";

const cors = Cors({
  allowMethods: ["POST", "HEAD", "OPTIONS"],
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new StripeInit(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    let event;
    try {
      event = await verifyStripe({ req, stripe, endpointSecret });
    } catch (e) {
      console.error(e);
    }
    console.log("Stripe Event: ", event);
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const auth0Id = paymentIntent.metadata.sub;

        const client = await clientPromise;
        const userProfile = await client
          .db()
          .collection("users")
          .updateOne(
            {
              auth0Id,
            },
            {
              $inc: {
                availableTokens: 10,
              },
              $setOnInsert: {
                auth0Id,
              },
            },
            {
              upsert: true,
            }
          );
      }
      default: {
        console.log("Unhandled Event: ", event);
      }
    }
    res.status(200).json({});
  }
};

const fuckHandler = async (req: IncomingMessage, res: ServerResponse) => {
  return handler(req as NextApiRequest, res as NextApiResponse);
};

export default cors(fuckHandler);
