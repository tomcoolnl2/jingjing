
export default function NotFound() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
                <p className="mt-4 text-lg text-gray-700">Sorry, the page you are looking for does not exist.</p>
                <a href="/" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
                    Go back to Home
                </a>
            </div>
        </div>
    );
}