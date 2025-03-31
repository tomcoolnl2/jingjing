import CredentialsProvider from "next-auth/providers/credentials";
import  User from '@/models/user';
import bcrypt from 'bcrypt';
import dbConnect from '@/utils/dbConnect';
import { AuthOptions, RequestInternal } from "next-auth";


export const authOptions: AuthOptions = {
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: Record<"username" | "password", string> | undefined, req: Pick<RequestInternal, "body" | "query" | "headers" | "method">) {
                if (!credentials) {
                    throw new Error('Missing credentials');
                }
                await dbConnect();
                const { username, password } = credentials;
                const user = await User.findOne({ email: username });
                if (!user) {
                    throw new Error('No user found');
                }
                const isPasswordmatched = await bcrypt.compare(password, user.password);
                if (!isPasswordmatched) {
                    throw new Error('Invalid password');
                }
                return user;
            }
        })
    ],
    pages: {
        signIn: '/login',  
        signOut: '/login',
        error: '/login',
        verifyRequest: '/login',
        newUser: '/register'
    },
};