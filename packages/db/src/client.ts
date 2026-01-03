import { PrismaClient } from "./generated/prisma/client.js" 
import { PrismaPg } from '@prisma/adapter-pg'
import dotenv from "dotenv";
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// Load .env from project root (search up from packages/db)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '../../..');
dotenv.config({ path: resolve(projectRoot, '.env') });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || new PrismaClient({adapter});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;