import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleCredentialsProvider from 'next-auth/providers/google';
import User from '@/models/user';
import bcrypt from 'bcrypt';
import dbConnect from '@/utils/dbConnect';
import { AuthOptions, RequestInternal } from 'next-auth';

export const authOptions: AuthOptions = {
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleCredentialsProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code',
                },
            },
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                };
            },
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                username: {
                    label: 'Username',
                    type: 'text',
                    placeholder: 'jsmith',
                },
                password: { label: 'Password', type: 'password' },
                email: {
                    label: 'Email',
                    type: 'text',
                    placeholder: 'john@doe.com',
                },
            },
            async authorize(
                credentials:
                    | Record<'username' | 'password' | 'email', string>
                    | undefined,
                req: Pick<
                    RequestInternal,
                    'body' | 'query' | 'headers' | 'method'
                >
            ) {
                if (!credentials) {
                    throw new Error('Missing credentials');
                }
                await dbConnect();
                const { password, email } = credentials;
                const user = await User.findOne({ email });
                if (!user) {
                    throw new Error('No user found');
                }
                const isPasswordmatched = await bcrypt.compare(
                    password,
                    user.password
                );
                if (!isPasswordmatched) {
                    throw new Error('Invalid password');
                }
                return user;
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            if (account?.provider === 'google') {
                const { id, name, email } = user;
                await dbConnect();
                const existingUser = await User.findOne({ email });
                if (!existingUser) {
                    const newUser = await User.create({ id, name, email });
                    return newUser ? true : false;
                }
            }
            return true;
        },
        async jwt({ token, user, account, profile }) {
            const existingUser = await User.findOne({ email: token.email });
            existingUser.password = undefined;
            existingUser.resetCode = undefined;
            existingUser.resetCodeExpires = undefined;
            token.user = existingUser;
            return token;
        },
        async session({ session, token }) {
            session.user = token.user as {
                name?: string | null;
                email?: string | null;
                image?: string | null;
            };
            return session;
        },
    },
    pages: {
        signIn: '/login',
        signOut: '/login',
        error: '/login',
        verifyRequest: '/login',
        newUser: '/register',
    },
};
