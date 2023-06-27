import { MongoClient } from "mongodb";

const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
  throw new Error("Missing .env variable 'MONGODB_URI'");
}

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(dbURI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(dbURI);
  clientPromise = client.connect();
}

export default clientPromise;
