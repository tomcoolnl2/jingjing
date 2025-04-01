import { AdminNavigation } from '@/components';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AdminNavigation />
            <div className="container">
                <h1 className="text-4xl font-bold text-center text-blue-600">Admin Dashboard</h1>
                <div className="row d=flex justify-content-center vh-100 align-items-center">
                    <div className="col-lg-5 shadow bg-light p-4 rounded">{children}</div>
                </div>
            </div>
        </>
    );
}
