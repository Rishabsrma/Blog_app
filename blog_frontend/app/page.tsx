'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth';

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

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      fetchPosts();
    } else if (!isLoading) {
      setLoading(false);
    }
  }, [isAuthenticated, isLoading]);

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/posts/', {
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Navbar />
        <div className="mt-8 text-center">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Navbar />
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold mb-6">Welcome to Blog App</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Join our community to read and share amazing blog posts!
          </p>
          <div className="space-y-4">
            <p className="text-gray-500 dark:text-gray-400">
              You need to be logged in to view posts and create content.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/register"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Get Started - Register
              </Link>
              <Link
                href="/login"
                className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition font-medium"
              >
                Already have an account? Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Navbar />
      <h1 className="text-3xl font-bold mt-6 mb-8">Latest Posts</h1>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No posts yet. Be the first to create one!
          </p>
          <Link
            href="/posts/create"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Create First Post
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post: Post) => (
            <article
              key={post.id}
              className="bg-white dark:bg-gray-800 border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{post.author.avatar}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {post.author.email}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    • {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
                <span className="text-lg">{post.mood}</span>
              </div>

              <Link href={`/posts/${post.id}`} className="block group">
                <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <span className="mt-3 inline-block text-blue-600 hover:underline">
                  Read more →
                </span>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
