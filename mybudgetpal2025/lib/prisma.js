//updated for prisma 7
//needed to do npm install @prisma/adapter-pg pg
import { PrismaClient } from '../src/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// 1. Create a connection pool using your environment variable
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// 2. Pass the adapter to the PrismaClient
const globalForPrisma = global;

export const prisma = 
  globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;