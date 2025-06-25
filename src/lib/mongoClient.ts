
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const options = {};

// 👇 Extend the NodeJS.Global type to add `_mongoClientPromise`
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Use globalThis._mongoClientPromise if available
let client;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default clientPromise;
