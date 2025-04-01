import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Get current time and database URL
 *     description: Returns the current time and the database URL from environment variables.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 time:
 *                   type: string
 *                   description: The current server time.
 *                 dbUrl:
 *                   type: string
 *                   description: The database URL.
 */
export async function GET(request: Request) {
    const dbUrl = process.env.DATABASE_URL;
    return NextResponse.json({ time: new Date().toLocaleString(), dbUrl });
}
