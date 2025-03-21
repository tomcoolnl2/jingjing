// filepath: /Users/tom.cool/dev/jingjing/apps/jingjing/src/app/components/TopNav.tsx
import Link from 'next/link';

const TopNav = () => {
  return (
    <nav className="bg-gray-200 p-4 shadow-md mb-4">
      <ul className="flex justify-center space-x-4">
        <li>
          <Link href="/">
            <a className="text-blue-600 hover:text-blue-800">Home</a>
          </Link>
        </li>
        <li>
          <Link href="/login">
            <a className="text-blue-600 hover:text-blue-800">Login</a>
          </Link>
        </li>
        <li>
          <Link href="/register">
            <a className="text-blue-600 hover:text-blue-800">Register</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default TopNav;