import NextAuth from 'next-auth';
import { authOptions } from '@/utils/authOptions';

/**
 * @swagger
 * /api/auth/[...nextauth]:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get authentication session
 *     description: Retrieves the current authentication session or redirects to the login page.
 *     responses:
 *       200:
 *         description: Successfully retrieved session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Handle authentication
 *     description: Handles authentication requests, such as login, logout, and callback.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               csrfToken:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
