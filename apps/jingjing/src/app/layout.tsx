'use client';
import { SessionProvider } from 'next-auth/react';
import { TopNavigation } from '@/components';

import 'bootstrap-material-design/dist/css/bootstrap-material-design.min.css';
import './global.css';

// export const metadata = {
//   title: 'Welcome to jingjing',
//   description: 'Generated by create-nx-workspace',
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <SessionProvider>
                <body>
                    <header>
                        <TopNavigation />
                    </header>
                    <main>{children}</main>
                </body>
            </SessionProvider>
        </html>
    );
}
