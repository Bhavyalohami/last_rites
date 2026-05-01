import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Plus } from 'lucide-react';
import { getConversations, startConversation } from '../../api/adminAPI';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const UserDashboard = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [subject, setSubject] = useState('');
  const { user } = useAuth();

  const fetchConversations = () => {
    setLoading(true);
    getConversations()
      .then((res) => setConversations(res.data))
      .catch(() => setError('Failed to load conversations.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleStartChat = async (event) => {
    event.preventDefault();
    try {
      await startConversation(subject || 'Family support request');
      setSubject('');
      setShowNewChat(false);
      fetchConversations();
    } catch {
      setError('Could not start conversation.');
    }
  };

  if (loading) return <Loader />;

  return (
    <main className="bg-[#f8f3ec] px-5 py-12 text-stone-900 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-lg bg-[#182522] p-8 text-white">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">Family dashboard</p>
          <h1 className="text-4xl font-semibold">Welcome, {user?.name || 'friend'}.</h1>
          <p className="mt-3 max-w-2xl leading-7 text-stone-300">
            Continue a conversation with the Last Rites team, ask a question, or start a new support request.
          </p>
        </div>

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-semibold text-stone-950">Conversations</h2>
          <button
            onClick={() => setShowNewChat((value) => !value)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-5 py-3 font-semibold text-white hover:bg-stone-800"
          >
            <Plus className="h-4 w-4" />
            {showNewChat ? 'Cancel' : 'New conversation'}
          </button>
        </div>

        {showNewChat && (
          <form onSubmit={handleStartChat} className="mb-6 flex flex-col gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-sm sm:flex-row">
            <input
              type="text"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="What do you need help with?"
              className="min-w-0 flex-1 rounded-lg border border-stone-200 bg-[#f8f3ec] px-4 py-3 outline-none focus:border-teal-900"
            />
            <button type="submit" className="rounded-full bg-teal-950 px-6 py-3 font-semibold text-white hover:bg-teal-900">
              Start
            </button>
          </form>
        )}

        {error && <ErrorMessage message={error} />}

        {conversations.length === 0 ? (
          <div className="rounded-lg border border-stone-200 bg-white p-10 text-center shadow-sm">
            <MessageCircle className="mx-auto mb-4 h-12 w-12 text-stone-300" />
            <p className="text-stone-500">You have no conversations yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <Link
                key={conversation.id}
                to={`/user/chat/${conversation.id}`}
                className="group block rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-xl font-semibold text-stone-950">{conversation.subject || 'Family support request'}</h3>
                    <p className="mt-1 text-sm text-stone-500">Status: <span className="capitalize">{conversation.status}</span></p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-stone-500">
                    {conversation.last_message_at && new Date(conversation.last_message_at).toLocaleString()}
                    <ArrowRight className="h-4 w-4 text-teal-900 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default UserDashboard;
