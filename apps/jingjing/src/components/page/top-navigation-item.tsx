import Link from 'next/link';

export interface Props {

}

export const TopNavigationItem = () => {
    return (
        <li>
            <Link href="/" className="text-blue-600 hover:text-blue-800">
                <span>Home</span>
            </Link>
        </li>
    );
};
