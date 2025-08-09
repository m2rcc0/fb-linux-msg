import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Messenger Clone</h1>
      <Link href="/auth" className="px-4 py-2 bg-blue-600 text-white rounded shadow">
        Sign In / Sign Up
      </Link>
    </main>
  );
}