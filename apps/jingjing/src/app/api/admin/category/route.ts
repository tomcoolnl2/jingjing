import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Category from '@/models/category';
import slugify from 'slugify';

/**
 * @swagger
 * /api/admin/category:
 *   post:
 *     summary: Create a new category
 *     description: Creates a new category with the provided name and description.
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
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 **/
export async function POST(req: Request) {
    await dbConnect();
    const { name, description } = await req.json();

    try {
        const category = await Category.create({ name, description, slug: slugify(name) });
        if (!category) {
            throw new Error('Category creation failed');
        }
        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message || 'Failed to create category' }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/admin/category:
 *   get:
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
 **/
export async function GET(req: Request) {
    await dbConnect();
    try {
        const categories = await Category.find({}).sort({ createdAt: -1 });
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message || 'Failed to fetch categories' }, { status: 500 });
    }
}
