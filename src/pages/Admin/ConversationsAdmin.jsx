import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock, Inbox, MessageSquare, Search, XCircle } from 'lucide-react';
import { getConversations, updateConversationStatus } from '../../api/adminAPI';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const statusConfig = {
  open: {
    icon: Clock,
    label: 'Open',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  pending: {
    icon: Clock,
    label: 'Pending',
    className: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  closed: {
    icon: XCircle,
    label: 'Closed',
    className: 'border-stone-200 bg-stone-100 text-stone-600',
  },
};

const ConversationsAdmin = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchConversations = () => {
    setLoading(true);
    getConversations()
      .then((res) => {
        setConversations(res.data);
        setError('');
      })
      .catch(() => setError('Failed to load conversations.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const filtered = useMemo(() => {
    return conversations.filter((conversation) => {
      const haystack = [
        conversation.subject,
        conversation.user_name,
        conversation.user_email,
        conversation.admin_name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const matchesSearch = haystack.includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'all' || conversation.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [conversations, query, statusFilter]);

  const counts = useMemo(() => {
    return conversations.reduce(
      (acc, conversation) => {
        acc.all += 1;
        acc[conversation.status] = (acc[conversation.status] || 0) + 1;
        return acc;
      },
      { all: 0, open: 0, pending: 0, closed: 0 }
    );
  }, [conversations]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateConversationStatus(id, newStatus);
      fetchConversations();
    } catch {
      setError('Failed to update status.');
    }
  };

  if (loading) return <Loader />;

  return (
    <main className="mx-auto max-w-7xl">
      <div className="mb-8 rounded-lg bg-[#182522] p-8 text-white">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">Admin inbox</p>
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <h1 className="text-4xl font-semibold">Family conversations</h1>
            <p className="mt-3 max-w-2xl leading-7 text-stone-300">
              Triage requests, assign ownership, and respond from a clear admin-only workspace.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {['all', 'open', 'pending', 'closed'].map((key) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`rounded-lg border px-4 py-3 transition ${
                  statusFilter === key ? 'border-amber-200 bg-amber-100 text-stone-950' : 'border-white/10 bg-white/5 text-stone-300 hover:bg-white/10'
                }`}
              >
                <p className="text-lg font-semibold">{counts[key]}</p>
                <p className="text-xs capitalize">{key}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="mb-6 flex flex-col gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by subject, family member, email, or admin"
            className="w-full rounded-full border border-stone-200 bg-[#fbf8f3] py-3 pl-12 pr-4 outline-none transition focus:border-teal-900"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-stone-200 bg-white p-10 text-center shadow-sm">
          <Inbox className="mx-auto mb-4 h-12 w-12 text-stone-300" />
          <p className="text-stone-500">No conversations match this view.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((conversation) => {
            const config = statusConfig[conversation.status] || statusConfig.open;
            const Icon = config.icon;
            return (
              <article key={conversation.id} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ede4d7] text-teal-950">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${config.className}`}>
                        <Icon className="h-4 w-4" />
                        {config.label}
                      </span>
                      {conversation.admin_name && (
                        <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-600">
                          <CheckCircle2 className="h-4 w-4" />
                          Assigned to {conversation.admin_name}
                        </span>
                      )}
                    </div>
                    <h2 className="truncate text-2xl font-semibold text-stone-950">{conversation.subject || 'Family support request'}</h2>
                    <p className="mt-2 text-sm text-stone-600">
                      <span className="font-semibold text-stone-950">Family:</span> {conversation.user_name} ({conversation.user_email})
                    </p>
                    <p className="mt-2 text-xs text-stone-500">
                      Last message: {conversation.last_message_at ? new Date(conversation.last_message_at).toLocaleString() : 'Not yet'}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                    <Link
                      to={`/admin/chats/${conversation.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-800"
                    >
                      Open thread
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <select
                      value={conversation.status}
                      onChange={(event) => handleStatusChange(conversation.id, event.target.value)}
                      className="rounded-full border border-stone-200 bg-[#fbf8f3] px-4 py-3 text-sm font-semibold outline-none focus:border-teal-900"
                    >
                      <option value="open">Open</option>
                      <option value="pending">Pending</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default ConversationsAdmin;
