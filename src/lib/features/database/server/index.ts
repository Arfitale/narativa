import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { env } from '$env/dynamic/private';

const sql = neon(env.NEON_CONNECTION_STRING);
export const db = drizzle(sql);
