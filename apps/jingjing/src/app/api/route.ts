import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api:
 *   get:
 *    description: Returns the current time and the database URL
 */
export async function GET(request: Request) {
    const dbUrl = process.env.DATABASE_URL;
    return NextResponse.json({ time: new Date().toLocaleString(), dbUrl });
}
