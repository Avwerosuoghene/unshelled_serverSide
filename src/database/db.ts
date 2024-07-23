import { configuration } from "../config/appconfig";
import dotenv from "dotenv";
import { IConfigurables } from "./types/models";
import { MongoClient, Db } from 'mongodb';


dotenv.config();

const nodeEnv = process.env.NODE_ENV!;
const mongodbURI = configuration[nodeEnv as keyof IConfigurables].mongoUrl
let db: Db;




export const connectDb = async (): Promise<MongoClient> => {
  const client = new MongoClient(mongodbURI, {
  });

  try {
    await client.connect();
    db = client.db(); 
    console.log('MongoDB connected');
    return client;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export const getDb = (): Db => {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
};

