import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/user';

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user with the provided name, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export async function POST(request: Request) {
    await dbConnect();
    const { name, email, password } = await request.json();
    try {
        const user = await new User({
            name,
            email,
            password: await bcrypt.hash(password, 10),
        });
        user.save();
        return NextResponse.json({ message: 'User created' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
