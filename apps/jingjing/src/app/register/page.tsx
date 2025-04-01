'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            } else {
                alert('User created successfully');
                setName('');
                setEmail('');
                setPassword('');
                router.push('/login');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container">
            <h1 className="text-4xl font-bold text-center text-blue-600">Register</h1>
            <div className="row d=flex justify-content-center vh-100 align-items-center">
                <div className="col-lg-5 shadow bg-light p-4 rounded">
                    <h2 className="mb-4 text-center">Register</h2>
                    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            className="form-control mb-4"
                            required
                        />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="form-control mb-4"
                            required
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="form-control mb-4"
                            required
                        />
                        <button
                            type="submit"
                            className="btn btn-primary btn-raised w-100"
                            disabled={loading || !name || !email || !password}
                        >
                            {loading ? 'Loading...' : 'Register'}
                        </button>
                        <p className="mt-4 text-center">
                            Already have an account?{' '}
                            <a href="/login" className="text-blue-600">
                                Login
                            </a>
                        </p>
                        <p className="mt-4 text-center">
                            <a href="/docs" className="text-blue-600" target="_blank">
                                API Docs
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </main>
    );
}
