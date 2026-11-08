import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ENV } from './environment';

let mongodInstance: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    // Attempt connecting to the configured MONGODB_URI
    mongoose.set('strictQuery', true);

    // If explicit in-memory requested or URI is default and testing/dev
    const connectionPromise = mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });

    await connectionPromise;
    console.log(`[Database] Successfully connected to MongoDB at: ${ENV.MONGODB_URI}`);
  } catch (error: any) {
    console.warn(`[Database] Could not connect to external MongoDB: ${error.message}`);
    console.log('[Database] Starting built-in in-memory MongoDB server for development...');

    try {
      mongodInstance = await MongoMemoryServer.create({
        instance: {
          dbName: 'referly',
        },
      });
      const uri = mongodInstance.getUri();
      await mongoose.connect(uri);
      console.log(`[Database] Connected to In-Memory MongoDB instance at: ${uri}`);
    } catch (memErr: any) {
      console.error('[Database] Fatal: Failed to initialize in-memory database:', memErr.message);
      throw memErr;
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    if (mongodInstance) {
      await mongodInstance.stop();
    }
    console.log('[Database] Disconnected from MongoDB');
  } catch (err: any) {
    console.error('[Database] Error while disconnecting:', err.message);
  }
};
