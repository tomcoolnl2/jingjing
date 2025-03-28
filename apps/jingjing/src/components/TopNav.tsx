// filepath: /Users/tom.cool/dev/jingjing/apps/jingjing/src/app/components/TopNav.tsx
import Link from 'next/link';

const TopNav = () => {
  return (
    <nav className="bg-gray-200 p-4 shadow-md mb-4">
      <ul className="flex justify-center space-x-4">
        <li>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link href="/login">
            <span className="text-blue-600 hover:text-blue-800">Login</span>
          </Link>
        </li>
        <li>
          <Link href="/register">
            <span className="text-blue-600 hover:text-blue-800">Register</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default TopNav;