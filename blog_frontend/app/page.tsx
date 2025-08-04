import Navbar from '@/components/Navbar';
import Link from 'next/link';

async function getPosts() {
  const res = await fetch('http://localhost:8000/api/posts/');
  return res.json();
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Navbar />
      <h1 className="text-3xl font-bold mt-6 mb-8">Latest Posts</h1>
      <div className="grid gap-6">
        {posts.map((post) => (
          <div key={post.id} className="border p-6 rounded-lg">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="mt-2">{post.content}</p>
            <Link
              href={`/posts/${post.id}`}
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              Read more →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
