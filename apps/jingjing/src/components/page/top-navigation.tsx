'use client';
import { useSession, signOut } from 'next-auth/react';
import { TopNavigationItem } from './top-navigation-item';

export const TopNavigation = () => {
    const { data, status } = useSession();
    const loading = status === 'loading';
    console.log({ data, status, loading });

    return (
        <nav className="bg-gray-200 p-4 shadow-md mb-4">
            <ul className="flex justify-center space-x-4">
                <TopNavigationItem href="/" label="Home" />
                {status === 'authenticated' && <TopNavigationItem href="/profile" label="Profile" />}
                {loading && <TopNavigationItem href="#" label="Loading..." />}
                {status === 'authenticated' && (
                    <TopNavigationItem
                        href="/login"
                        label="Sign Out"
                        onClick={() => signOut({ callbackUrl: '/login' })}
                    />
                )}
                {status === 'unauthenticated' && <TopNavigationItem href="/login" label="Login" />}
                {status === 'unauthenticated' && <TopNavigationItem href="/register" label="Register" />}
            </ul>
        </nav>
    );
};
