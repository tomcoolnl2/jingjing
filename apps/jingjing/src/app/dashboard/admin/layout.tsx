import { AdminNavigation } from '@/components';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AdminNavigation />
            <div className="container">
                <h1 className="text-4xl font-bold text-center text-blue-600">Admin Dashboard</h1>
                {children}
            </div>
        </>
    );
}
