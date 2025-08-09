import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else router.push('/chat');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else router.push('/chat');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <form className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Sign In / Sign Up</h2>
        <input
          className="w-full p-2 mb-2 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 mb-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <div className="flex justify-between">
          <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={handleSignIn} disabled={loading}>
            Sign In
          </button>
          <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={handleSignUp} disabled={loading}>
            Sign Up
          </button>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </form>
    </main>
  );
}