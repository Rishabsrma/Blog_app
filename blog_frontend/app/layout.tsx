import type { Metadata } from 'next';
import './globals.css';
import ToastContainer from '@/components/ToastContainer';
import AuthInitializer from '@/components/AuthInitializer';

export const metadata: Metadata = {
  title: 'Blog Application',
  description: 'Blog Application with Next.js and django',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100"
    >
      <body className="min-h-screen transition-colors duration-300">
        <AuthInitializer />
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
