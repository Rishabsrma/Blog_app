'use client';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth';
import { useToastStore } from '@/lib/store/toast';

export default function Navbar() {
  const { isAuthenticated, user, logout, isLoading } = useAuthStore();
  const { addToast } = useToastStore();

  const handleLogout = () => {
    logout();
    addToast('Successfully logged out!', 'success');
  };

  if (isLoading) {
    return (
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link
            href="/"
            className="text-xl font-bold text-blue-600 dark:text-blue-400"
          >
            Blog App
          </Link>
          <div className="flex gap-4">
            <div className="px-4 py-2 text-gray-500">Loading...</div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="text-xl font-bold text-blue-600 dark:text-blue-400"
        >
          Blog App
        </Link>
        <div className="flex gap-4 items-center">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {user?.email}
              </span>
              <Link
                href="/posts/create"
                className="px-4 py-2  text-white rounded bg-blue-800"
              >
                Create Post
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
