import slugify from 'slugify';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import dbConnect from '@/utils/dbConnect';
import Category from '@/models/category';

/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: Endpoints for managing categories in the admin panel
 */

/**
 * @swagger
 * /api/admin/category:
 *   post:
 *     tags:
 *       - Categories
 *     summary: Create a new category
 *     description: Creates a new category with the provided name and description. Only accessible to admin users.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Forbidden
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Category not found
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
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: StatusCodes.UNAUTHORIZED });
    }

    const userRole = session.user.role;
    if (userRole !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: StatusCodes.FORBIDDEN });
    }

    try {
        await dbConnect();
        const { name, description } = await req.json();
        const category = await Category.create({ name, description, slug: slugify(name) });
        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: StatusCodes.NOT_FOUND });
        }
        return NextResponse.json(category, { status: StatusCodes.CREATED });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message || 'Failed to create category' },
            { status: StatusCodes.INTERNAL_SERVER_ERROR },
        );
    }
}

/**
 * @swagger
 * /api/admin/category:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get all categories
 *     description: Returns a list of all categories.
 *     responses:
 *       200:
 *         description: A list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   slug:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
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
export async function GET(req: Request) {
    await dbConnect();
    try {
        const categories = await Category.find({}).sort({ createdAt: -1 });
        return NextResponse.json(categories, { status: StatusCodes.OK });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message || 'Failed to fetch categories' },
            { status: StatusCodes.INTERNAL_SERVER_ERROR },
        );
    }
}
