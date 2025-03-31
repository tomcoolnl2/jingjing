'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

const TopNav = () => {
  const { data, status } = useSession();
  const loading = status === 'loading';
  console.log({ data, status, loading });

  return (
    <nav className="bg-gray-200 p-4 shadow-md mb-4">
      <ul className="flex justify-center space-x-4">
        <li>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            <span>Home</span>
          </Link>
        </li>
        {status === 'authenticated' && (
          <li>
            <Link href="/profile">
              <span className="text-blue-600 hover:text-blue-800">Profile</span>
            </Link>
          </li>
        )}
        {loading && (
          <li>
            <span className="text-blue-600">Loading...</span>
          </li>
        )}
        {status === 'authenticated' && (
          <li>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-blue-600 hover:text-blue-800"
            >
              Sign Out
            </button>
          </li>
        )}
        {status === 'unauthenticated' && (
          <li>
            <Link href="/login">
              <span className="text-blue-600 hover:text-blue-800">Login</span>
            </Link>
          </li>
        )}
        {status === 'unauthenticated' && (
          <li>
            <Link href="/register">
              <span className="text-blue-600 hover:text-blue-800">Register</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default TopNav;