'use client';
import { useSession } from 'next-auth/react';
import { TopNavigationItem } from './top-navigation-item';

export const AdminNavigation = () => {
    const { data, status } = useSession();
    const loading = status === 'loading';
    console.log('AdminNavigation', { data, status, loading });

    return (
        <nav className="bg-gray-200 p-4 shadow-md mb-4">
            <ul className="flex justify-center space-x-4">
                <TopNavigationItem href="/dashboard/admin" label="Admin" />
                <TopNavigationItem href="/dashboard/admin/category" label="Create Category" />
            </ul>
        </nav>
    );
};
