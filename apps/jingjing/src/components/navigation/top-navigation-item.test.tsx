import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TopNavigationItem, Props } from './top-navigation-item';

describe('TopNavigationItem', () => {
    const defaultProps: Props = {
        href: '/test',
        label: 'Test Label',
        onClick: jest.fn(),
    };

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('renders the link with the correct href and label', () => {
        render(<TopNavigationItem {...defaultProps} />);
        const linkElement = screen.getByRole('link', { name: /test label/i });

        expect(linkElement).toBeInTheDocument();
        expect(linkElement).toHaveAttribute('href', '/test');
    });

    it('calls the onClick handler when clicked', () => {
        render(<TopNavigationItem {...defaultProps} />);
        const linkElement = screen.getByRole('link', { name: /test label/i });

        fireEvent.click(linkElement);
        expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    });

    it('applies the correct CSS classes', () => {
        render(<TopNavigationItem {...defaultProps} />);
        const linkElement = screen.getByRole('link', { name: /test label/i });

        expect(linkElement).toHaveClass('text-blue-600 hover:text-blue-800');
    });

    it('renders without crashing when onClick is not provided', () => {
        const { container } = render(<TopNavigationItem href="/test" label="Test Label" />);
        expect(container).toBeInTheDocument();
    });
});
