// =============================================================================
// Athlete Risk Intelligence Platform
// Root Layout — Wraps application in DemoProvider and RoleSwitcher navigation
// =============================================================================

import type { Metadata } from 'next';
import './globals.css';
import { DemoProvider } from '../context/DemoContext';
import { RoleSwitcher } from '../components/ui/RoleSwitcher';

export const metadata: Metadata = {
  title: 'Connecto Athlete Risk Intelligence Platform | B2B University Sports SaaS',
  description:
    'Early warning injury and dropout risk intelligence for university sports departments. Connects athletes, coaches, physios, and athletics directors in one platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
        <DemoProvider>
          <div className="flex min-h-screen flex-col">
            <RoleSwitcher />
            <main className="flex-1 px-4 py-8 sm:px-6 md:py-10">
              <div className="mx-auto max-w-7xl">{children}</div>
            </main>
            <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
              <p>
                Connecto Athlete Risk Intelligence Platform • MVP Phase 1 Pilot •
                University Sports Department Edition
              </p>
            </footer>
          </div>
        </DemoProvider>
      </body>
    </html>
  );
}
