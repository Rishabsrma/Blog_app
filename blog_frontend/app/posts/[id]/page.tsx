'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth';
import { useToastStore } from '@/lib/store/toast';
import Navbar from '@/components/Navbar';
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

export default function PostDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const { addToast } = useToastStore();
  const { id } = use(params);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      fetchPost();
    } else if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [id, isAuthenticated, isLoading, router]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/posts/${id}/`);
      const data = await res.json();

      if (res.ok) {
        setPost(data);
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

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8000/api/posts/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        addToast('Post deleted successfully!', 'success');
        router.push('/');
      } else {
        const data = await res.json();
        addToast(data.error || 'Failed to delete post', 'error');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      addToast('Network error. Please try again.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Navbar />
        <div className="mt-8 text-center">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
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
    );
  }

  const isAuthor = isAuthenticated && user?.id === post.author.id;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Navbar />
      <div className="mt-8">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Back to posts
        </Link>

        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{post.author.avatar}</span>
              <div>
                <p className="font-medium">{post.author.email}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <span className="text-2xl">{post.mood}</span>
          </div>

          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>

          {isAuthor && (
            <div className="mt-6 pt-6 border-t flex gap-4">
              <Link
                href={`/posts/${post.id}/edit`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Edit Post
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Post'}
              </button>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
