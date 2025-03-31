import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from './page';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({
    get: jest.fn((key) => (key === 'callbackUrl' ? '/' : null)),
  })),
}));

describe('LoginPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it('renders the login form', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Login with Google')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('disables the login button when email or password is empty', () => {
    render(<LoginPage />);
    const loginButton = screen.getByText('Login');
    expect(loginButton).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    expect(loginButton).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    expect(loginButton).not.toBeDisabled();
  });

  it('calls signIn on form submission with valid credentials', async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: null });

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Login'));

    expect(signIn).toHaveBeenCalledWith('credentials', {
      email: 'test@example.com',
      password: 'password',
      redirect: false,
      callbackUrl: '/',
    });
    expect(await screen.findByText('Login')).toBeInTheDocument();
  });

  it('logs an error if signIn fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (signIn as jest.Mock).mockResolvedValue({ error: 'Invalid credentials' });

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Login'));

    expect(signIn).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(new Error('Invalid credentials'));
    consoleErrorSpy.mockRestore();
  });

  it('redirects to the callbackUrl on successful login', async () => {
    (signIn as jest.Mock).mockResolvedValue({ error: null });

    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Login'));

    expect(signIn).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('calls signIn with Google when "Login with Google" is clicked', () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText('Login with Google'));

    expect(signIn).toHaveBeenCalledWith('google', { callbackUrl: '/' });
  });

  it('navigates to the register page when "Register" is clicked', () => {
    render(<LoginPage />);
    fireEvent.click(screen.getByText('Register'));

    expect(mockPush).toHaveBeenCalledWith('/register');
  });

  it('logs an error if there is an error in the searchParams', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.mock('next/navigation', () => ({
      useSearchParams: jest.fn(() => ({
        get: jest.fn((key) => (key === 'error' ? 'Some error' : null)),
      })),
    }));

    render(<LoginPage />);
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error during login:', 'Some error');
    consoleErrorSpy.mockRestore();
  });
});