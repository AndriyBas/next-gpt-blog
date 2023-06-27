import { ObjectId, WithId } from "mongodb";

export interface MongoPost extends WithId<Document> {
  title: string;
  keywords: string;
  postContent: string;
  metaDescription: string;
  userId: ObjectId;
  topic: string;
}
