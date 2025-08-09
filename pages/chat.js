import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/router';

export default function ChatPage() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push('/auth');
      else setUser(user);
    });
    // Subscribe to new messages
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, payload =>
        setMessages(messages => [...messages, payload.new])
      )
      .subscribe();

    fetchMessages();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchMessages() {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: true });
    setMessages(data || []);
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!content.trim()) return;
    await supabase.from('messages').insert({ content, user_id: user.id });
    setContent('');
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-lg bg-white rounded shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Chat Room</h2>
          <button className="text-sm text-red-600" onClick={handleSignOut}>Sign Out</button>
        </div>
        <div className="h-96 overflow-y-scroll mb-4 border rounded p-2 bg-gray-50">
          {messages.map(msg => (
            <div key={msg.id} className="mb-2">
              <span className="font-semibold">{msg.user_id.slice(0, 6)}:</span> {msg.content}
            </div>
          ))}
        </div>
        <form className="flex" onSubmit={sendMessage}>
          <input
            className="flex-1 border rounded p-2 mr-2"
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Type a message..."
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Send</button>
        </form>
      </div>
    </main>
  );
}