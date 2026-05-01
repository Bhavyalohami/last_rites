import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, Send, UserRound } from 'lucide-react';
import { getConversationMessages, sendMessage } from '../../api/adminAPI';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const statusStyles = {
  open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  closed: 'bg-stone-100 text-stone-600 border-stone-200',
};

const AdminChat = () => {
  const { id } = useParams();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
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
        if (err.response?.status === 403) navigate('/admin/conversations');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    setLoading(true);
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

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
    <main className="mx-auto max-w-6xl">
      <Link to="/admin/conversations" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-950">
        <ArrowLeft className="h-4 w-4" />
        Back to conversations
      </Link>

      <section className="grid overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm lg:grid-cols-[320px_1fr]">
        <aside className="border-b border-stone-200 bg-[#fbf8f3] p-6 lg:border-b-0 lg:border-r">
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-stone-950 text-xl font-semibold text-white">
            {conversation?.user_name?.charAt(0) || 'F'}
          </div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-teal-900">Family request</p>
          <h1 className="text-3xl font-semibold leading-tight text-stone-950">
            {conversation?.subject || 'Family support request'}
          </h1>
          <div className={`mt-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${statusStyles[conversation?.status] || statusStyles.open}`}>
            {conversation?.status === 'closed' ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
            <span className="capitalize">{conversation?.status}</span>
          </div>

          <div className="mt-8 space-y-4 rounded-lg border border-stone-200 bg-white p-4 text-sm">
            <div>
              <p className="text-stone-500">User</p>
              <p className="mt-1 font-semibold text-stone-950">{conversation?.user_name}</p>
            </div>
            <div>
              <p className="text-stone-500">Email</p>
              <p className="mt-1 break-all font-semibold text-stone-950">{conversation?.user_email}</p>
            </div>
            {conversation?.admin_name && (
              <div>
                <p className="text-stone-500">Assigned admin</p>
                <p className="mt-1 font-semibold text-stone-950">{conversation.admin_name}</p>
              </div>
            )}
          </div>
        </aside>

        <div className="flex min-h-[650px] flex-col">
          <header className="border-b border-stone-200 px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-stone-950">Conversation timeline</h2>
                <p className="mt-1 text-sm text-stone-500">Family messages stay on the left. Admin replies stay on the right.</p>
              </div>
            </div>
            {error && <div className="mt-3 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">{error}</div>}
          </header>

          <div className="flex-1 overflow-y-auto bg-[#f8f3ec] p-6">
            <div className="space-y-5">
              {messages.map((message) => {
                const isAdmin = message.sender_role === 'admin';
                return (
                  <div key={message.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[78%] rounded-lg px-4 py-3 shadow-sm ${isAdmin ? 'bg-stone-950 text-white' : 'bg-white text-stone-900'}`}>
                      <div className="mb-2 flex items-center gap-2">
                        <UserRound className={`h-4 w-4 ${isAdmin ? 'text-amber-200' : 'text-teal-900'}`} />
                        <p className={`text-sm font-semibold ${isAdmin ? 'text-amber-100' : 'text-teal-900'}`}>
                          {isAdmin ? `Admin: ${message.sender_name}` : `Family: ${message.sender_name}`}
                        </p>
                      </div>
                      <p className="leading-7">{message.message}</p>
                      <p className={`mt-2 text-right text-xs ${isAdmin ? 'text-white/60' : 'text-stone-400'}`}>
                        {new Date(message.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={handleSend} className="flex flex-col gap-3 border-t border-stone-200 bg-white p-4 sm:flex-row">
            <input
              type="text"
              value={newMessage}
              onChange={(event) => setNewMessage(event.target.value)}
              placeholder={conversation?.status === 'closed' ? 'Conversation is closed.' : 'Reply as admin...'}
              className="min-w-0 flex-1 rounded-full border border-stone-200 bg-[#fbf8f3] px-5 py-3 outline-none transition focus:border-teal-900"
              disabled={conversation?.status === 'closed'}
            />
            <button
              type="submit"
              disabled={sending || conversation?.status === 'closed'}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-6 py-3 font-semibold text-white transition hover:bg-stone-800 disabled:opacity-60"
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

export default AdminChat;
