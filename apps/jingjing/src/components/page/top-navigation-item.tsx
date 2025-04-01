import Link from 'next/link';

export interface Props {
    href: string;
    label: string;
    onClick?: () => void;
}

export const TopNavigationItem: React.FC<Props> = ({ href, label, onClick = () => {} }) => {
    return (
        <li>
            <Link href={href} className="text-blue-600 hover:text-blue-800" onClick={onClick}>
                <span>{label}</span>
            </Link>
        </li>
    );
};
