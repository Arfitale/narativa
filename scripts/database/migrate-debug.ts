import { drizzle } from 'drizzle-orm/node-postgres'; // or your specific driver
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const pool = new pg.Pool({
	connectionString: process.env.DATABASE_URL
});

const db = drizzle(pool);

async function main() {
	console.log('Connecting to:', process.env.DATABASE_URL);
	console.log('Running migrations programmatically...');
	try {
		await migrate(db, { migrationsFolder: './drizzle' }); // Adjust path if needed
		console.log('Success!');
	} catch (error) {
		console.error('The actual database error is:', error);
	} finally {
		await pool.end();
	}
}

main();
