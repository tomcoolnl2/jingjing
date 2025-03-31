"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';


export default function LoginPage() {
    const router = useRouter();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl: "/",
            });
            
            if (result?.error) {
                throw new Error(result.error);
            } else {
                console.log("Login successful");
                router.push("/");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return  (
        <main className="container">
            <h1 className="text-4xl font-bold text-center text-blue-600">Login</h1>
            <div className="row d=flex justify-content-center vh-100 align-items-center">
                <div className="col-lg-5 shadow bg-light p-4 rounded">
                    <h2 className="mb-4 text-center">Register</h2>
                    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">    
                        
                        <input type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' className="form-control mb-4" required />
                        <input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' className="form-control mb-4" required />
                        <button type='submit' className="btn btn-primary btn-raised w-100" disabled={loading || !email || !password}>
                            {loading ? "Loading..." : "Login"}
                        </button>
                        <p className="mt-4 text-center">
                            <a href="/docs" className="text-blue-600" target='_blank'>API Docs</a>
                        </p>  
                    </form>
                </div>
            </div>
        </main>
    );
}