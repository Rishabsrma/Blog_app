'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useToastStore } from '@/lib/store/toast';

const MOOD_CHOICES = [
  { value: '💻', label: 'Tech' },
  { value: '🎨', label: 'Creative' },
  { value: '🤔', label: 'Thought' },
];

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('💻');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToastStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!title.trim() || !content.trim()) {
        addToast('Title and content are required', 'error');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        addToast('Session expired. Please login again.', 'error');
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:8000/api/posts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, mood }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        addToast(errorData.error || 'Failed to create post', 'error');
        return;
      }

      addToast('Post created successfully!', 'success');
      router.push('/');
    } catch (err) {
      console.error('Error creating post:', err);
      addToast('An unknown error occurred', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-4">
        <Navbar />
        <div className="max-w-2xl mx-auto mt-8">
          <Link
            href="/"
            className="text-blue-600 hover:underline mb-4 inline-block"
          >
            ← Back to posts
          </Link>

          <h1 className="text-2xl font-bold mb-6">Create New Post</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
            />

            <select
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              disabled={loading}
            >
              {MOOD_CHOICES.map((choice) => (
                <option key={choice.value} value={choice.value}>
                  {choice.value} {choice.label}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Content"
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 min-h-[200px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              required
            />

            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition flex items-center justify-center disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Publishing...
                </>
              ) : (
                'Publish'
              )}
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
