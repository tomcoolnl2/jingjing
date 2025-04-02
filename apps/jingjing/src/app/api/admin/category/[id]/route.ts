import slugify from 'slugify';
import { StatusCodes } from 'http-status-codes';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import dbConnect from '@/utils/dbConnect';
import Category from '@/models/category';

type Context = {
    params: {
        id: string;
    };
};

/**
 * @swagger
 * /api/admin/category/[id]:
 *   post:
 *     tags:
 *       - Categories
 *     summary: Get a category
 *     description: Retrieves a category with the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the category to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
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
export async function GET(req: Request, context: Context) {
    try {
        await dbConnect();
        const category = await Category.findById(context.params.id);
        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: StatusCodes.NOT_FOUND });
        }
        return NextResponse.json(category, { status: StatusCodes.OK });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message || 'Failed to fetch category' },
            { status: StatusCodes.INTERNAL_SERVER_ERROR },
        );
    }
}

/**
 * @swagger
 * /api/admin/category/[id]:
 *   delete:
 *     tags:
 *       - Categories
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
export async function DELETE(req: Request, context: Context) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: StatusCodes.UNAUTHORIZED });
        }

        const userRole = session.user.role;
        if (userRole !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: StatusCodes.FORBIDDEN });
        }

        await dbConnect();

        const category = await Category.findByIdAndDelete(context.params.id);
        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: StatusCodes.NOT_FOUND });
        }

        return NextResponse.json({ message: 'Category deleted successfully' }, { status: StatusCodes.OK });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message || 'Failed to delete category' },
            { status: StatusCodes.INTERNAL_SERVER_ERROR },
        );
    }
}

/**
 * @swagger
 * /api/admin/category/[id]:
 *   put:
 *     tags:
 *       - Categories
 *     summary: Update a category
 *     description: Updates a category with the provided ID and new data.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the category to update.
 *         schema:
 *           type: string
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
 *       200:
 *         description: Category updated successfully
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
export async function PUT(req: Request, context: Context) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: StatusCodes.UNAUTHORIZED });
        }

        const userRole = session.user.role;
        if (userRole !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: StatusCodes.FORBIDDEN });
        }

        await dbConnect();

        const { name, description } = await req.json();
        const category = await Category.findByIdAndUpdate(
            context.params.id,
            { name, description, slug: slugify(name) },
            { new: true },
        );

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: StatusCodes.NOT_FOUND });
        }

        return NextResponse.json(category, { status: StatusCodes.OK });
        //
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message || 'Failed to update category' },
            { status: StatusCodes.INTERNAL_SERVER_ERROR },
        );
    }
}

/**
 * @swagger
 * /api/admin/category/[id]:
 *   patch:
 *     tags:
 *       - Categories
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
export async function PATCH(req: Request, context: Context) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: StatusCodes.UNAUTHORIZED });
        }

        const userRole = session.user.role;
        if (userRole !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: StatusCodes.FORBIDDEN });
        }

        await dbConnect();

        const { name, description } = await req.json();
        const category = await Category.findByIdAndUpdate(
            context.params.id,
            { name, description, slug: slugify(name) },
            { new: true },
        );
        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: StatusCodes.NOT_FOUND });
        }

        return NextResponse.json(category, { status: StatusCodes.OK });
        //
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message || 'Failed to update category' },
            { status: StatusCodes.INTERNAL_SERVER_ERROR },
        );
    }
}
