import "server-only";
import { MongoClient, type Db } from "mongodb";
// One client per server process; dev hot reloads reuse it through globalThis.
const cache = globalThis as unknown as {
  ogjMongo?: Promise<MongoClient>;
  ogjIndexes?: Promise<unknown>;
};
export function mongoConfigured() {
  return !!process.env.MONGODB_URI;
}
export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");
  cache.ogjMongo ??= new MongoClient(uri, { maxPoolSize: 10 }).connect();
  const db = (await cache.ogjMongo).db(process.env.MONGODB_DB || "onegoodjune");
  cache.ogjIndexes ??= Promise.all([
    db
      .collection("registrations")
      .createIndex({ reference: 1 }, { unique: true }),
    db.collection("registrations").createIndex({ createdAt: -1 }),
    db.collection("registrations").createIndex({ program: 1, status: 1 }),
    db.collection("payments").createIndex({ reference: 1 }, { unique: true }),
  ]);
  await cache.ogjIndexes;
  return db;
}
