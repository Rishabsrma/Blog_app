'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { useToastStore } from '@/lib/store/toast';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    email: string;
    avatar: string;
  };
  mood: string;
  created_at: string;
}

const MOOD_CHOICES = [
  { value: '💻', label: 'Tech' },
  { value: '🎨', label: 'Creative' },
  { value: '🤔', label: 'Thought' },
];

export default function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('💻');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const { id } = use(params);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/posts/${id}/`);
      const data = await res.json();

      if (res.ok) {
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
        setMood(data.mood);

        // Check if user is the author
        if (isAuthenticated && user?.id !== data.author.id) {
          setError('You can only edit your own posts');
        }
      } else {
        setError(data.error || 'Post not found');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!title.trim() || !content.trim()) {
        addToast('Title and content are required', 'error');
        setSaving(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        addToast('Session expired. Please login again.', 'error');
        setSaving(false);
        return;
      }

      const res = await fetch(`http://localhost:8000/api/posts/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, mood }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        addToast(errorData.error || 'Failed to update post', 'error');
        return;
      }

      addToast('Post updated successfully!', 'success');
      router.push(`/posts/${id}`);
    } catch (err) {
      console.error('Error updating post:', err);
      addToast('An unknown error occurred', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto p-4">
          <Navbar />
          <div className="mt-8 text-center">Loading...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !post) {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto p-4">
          <Navbar />
          <div className="mt-8">
            <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
              {error || 'Post not found'}
            </div>
            <Link href="/" className="text-blue-600 hover:underline">
              ← Back to posts
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const isAuthor = isAuthenticated && user?.id === post.author.id;

  if (!isAuthor) {
    return (
      <ProtectedRoute>
        <div className="max-w-4xl mx-auto p-4">
          <Navbar />
          <div className="mt-8">
            <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
              You can only edit your own posts
            </div>
            <Link
              href={`/posts/${id}`}
              className="text-blue-600 hover:underline"
            >
              ← Back to post
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-4">
        <Navbar />
        <div className="max-w-2xl mx-auto mt-8">
          <Link
            href={`/posts/${id}`}
            className="text-blue-600 hover:underline mb-4 inline-block"
          >
            ← Back to post
          </Link>

          <h1 className="text-2xl font-bold mb-6">Edit Post</h1>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={saving}
              required
            />

            <select
              className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              disabled={saving}
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
              disabled={saving}
              required
            />

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-50"
                disabled={saving}
              >
                {saving ? (
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
                    Updating...
                  </>
                ) : (
                  'Update Post'
                )}
              </button>

              <Link
                href={`/posts/${id}`}
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
