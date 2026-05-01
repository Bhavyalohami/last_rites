import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { getConversationMessages, sendMessage } from '../../api/adminAPI';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const Chat = () => {
  const { id } = useParams();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const fetchMessages = useCallback(() => {
    getConversationMessages(id)
      .then((res) => {
        setConversation(res.data.conversation);
        setMessages(res.data.messages);
        setError('');
      })
      .catch((err) => {
        setError('Failed to load messages.');
        if (err.response?.status === 403) navigate('/user/dashboard');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    setLoading(true);
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [id, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (event) => {
    event.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      await sendMessage(id, newMessage);
      setNewMessage('');
      fetchMessages();
    } catch {
      setError('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loader />;
  if (error && !conversation) return <ErrorMessage message={error} />;

  return (
    <main className="bg-[#f8f3ec] px-5 py-12 text-stone-900 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-4xl">
        <Link to="/user/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-950">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
          <header className="border-b border-stone-200 bg-[#182522] px-6 py-5 text-white">
            <h1 className="text-2xl font-semibold">{conversation?.subject || 'Family support request'}</h1>
            <p className="mt-1 text-sm text-stone-300">Status: <span className="capitalize">{conversation?.status}</span></p>
          </header>

          {error && <div className="border-b border-amber-200 bg-amber-50 px-6 py-3 text-sm text-amber-800">{error}</div>}

          <div className="h-[28rem] overflow-y-auto bg-[#fbf8f3] p-6">
            <div className="space-y-4">
              {messages.map((message) => {
                const isUser = message.sender_id === user.id;
                return (
                  <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[82%] rounded-lg px-4 py-3 shadow-sm ${isUser ? 'bg-teal-950 text-white' : 'bg-white text-stone-800'}`}>
                      <p className={`mb-1 text-xs font-semibold ${isUser ? 'text-amber-100' : 'text-teal-900'}`}>{message.sender_name}</p>
                      <p className="leading-7">{message.message}</p>
                      <p className={`mt-2 text-right text-xs ${isUser ? 'text-white/70' : 'text-stone-400'}`}>
                        {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={handleSend} className="flex flex-col gap-3 border-t border-stone-200 p-4 sm:flex-row">
            <input
              type="text"
              value={newMessage}
              onChange={(event) => setNewMessage(event.target.value)}
              placeholder={conversation?.status === 'closed' ? 'This conversation is closed.' : 'Type your message...'}
              className="min-w-0 flex-1 rounded-full border border-stone-200 bg-[#f8f3ec] px-4 py-3 outline-none focus:border-teal-900"
              disabled={conversation?.status === 'closed'}
            />
            <button
              type="submit"
              disabled={sending || conversation?.status === 'closed'}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-6 py-3 font-semibold text-white hover:bg-stone-800 disabled:opacity-60"
            >
              {sending ? 'Sending...' : 'Send'}
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Chat;
