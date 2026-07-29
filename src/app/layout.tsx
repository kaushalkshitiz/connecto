// =============================================================================
// AI Athlete Growth Platform
// Root Layout — Top Navigation Navbar + Theme & Demo Providers
// =============================================================================

import type { Metadata } from 'next';
import './globals.css';
import { DemoProvider } from '../context/DemoContext';
import { ThemeProvider } from '../context/ThemeContext';
import { Navbar } from '../components/ui/Navbar';

export const metadata: Metadata = {
  title: 'CONNECTO SPORTS AI | Athlete Growth & Risk Intelligence Platform',
  description:
    'AI-powered athlete development, load management, task tracking, scholarship discovery, and injury prevention for university sports programs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-700 dark:selection:text-emerald-300 transition-colors duration-300">
        <ThemeProvider>
          <DemoProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 flex flex-col">{children}</main>
              <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
                <p>
                  CONNECTO SPORTS AI • Athlete Growth &amp; Risk Intelligence Platform •
                  Stanford University Track &amp; Field Pilot
                </p>
              </footer>
            </div>
          </DemoProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
