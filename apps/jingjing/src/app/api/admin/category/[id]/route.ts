import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Category from '@/models/category';
import slugify from 'slugify';

type Context = {
    params: {
        id: string; // Replace 'id' with your dynamic route parameter name
    };
};

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
export async function GET(req: Request, context: Context) {
    await dbConnect();
    const { id } = context.params;
    try {
        const category = await Category.findById(id);
        if (!category) {
            throw new Error('Category not found');
        }
        return NextResponse.json(category, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message || 'Failed to fetch category' }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/admin/category:
 *   delete:
 *     summary: Delete a category
 *     description: Deletes a category with the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the category to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
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
export async function DELETE(req: Request) {
    await dbConnect();
    const { id } = await req.json();

    try {
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            throw new Error('Category deletion failed');
        }
        return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message || 'Failed to delete category' }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/admin/category:
 *   put:
 *     summary: Update a category
 *     description: Updates a category with the provided ID and new data.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the category to update.
 *         schema:
 *           type: string
 *    responses:
 *       200:
 *         description: Category updated successfully
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
export async function PUT(req: Request, context: Context) {
    await dbConnect();
    const { name, description } = await req.json();

    try {
        const category = await Category.findByIdAndUpdate(
            context.params.id,
            { name, description, slug: slugify(name) },
            { new: true },
        );
        if (!category) {
            throw new Error('Category update failed');
        }
        return NextResponse.json(category, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message || 'Failed to update category' }, { status: 500 });
    }
}

/**
 * @swagger
 * /api/admin/category:
 *   patch:
 *     summary: Update a category
 *     description: Updates a category with the provided ID and new data.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the category to update.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
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
export async function PATCH(req: Request) {
    await dbConnect();
    const { id, name, description } = await req.json();

    try {
        const category = await Category.findByIdAndUpdate(
            id,
            { name, description, slug: slugify(name) },
            { new: true },
        );
        if (!category) {
            throw new Error('Category update failed');
        }
        return NextResponse.json(category, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message || 'Failed to update category' }, { status: 500 });
    }
}
