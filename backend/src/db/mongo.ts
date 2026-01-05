import mongoose from "mongoose";

const DEFAULT_LOCAL = 'mongodb://127.0.0.1:27017/react';

export const connectDB = async () => {
  const primary = process.env.DB_URL;
  const localEnv = process.env.DB_URL_LOCAL;
  const candidates = [primary, localEnv, DEFAULT_LOCAL].filter(Boolean) as string[];

  for (const uri of candidates) {
    try {
      await mongoose.connect(uri, { dbName: process.env.DB_NAME || undefined });
      console.log(`Connected to MongoDB using ${uri.startsWith('mongodb+srv') ? 'SRV' : 'URI'}: ${uri}`);
      return;
    } catch (err) {
      console.warn(`Failed to connect with URI: ${uri}`);
      console.warn(err);
    }
  }

  console.error('All MongoDB connection attempts failed. Continuing without DB.');
};