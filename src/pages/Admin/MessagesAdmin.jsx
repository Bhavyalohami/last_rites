import React, { useEffect, useState } from 'react';
import { Eye, Mail, Search, Trash2 } from 'lucide-react';
import { deleteMessage, getMessages } from '../../api/adminAPI';
import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import Modal from '../../components/UI/Modal';

const MessagesAdmin = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingMessage, setViewingMessage] = useState(null);

  const fetchMessages = () => {
    setLoading(true);
    getMessages()
      .then((res) => {
        setMessages(res.data);
        setError('');
      })
      .catch(() => setError('Failed to load messages.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filtered = messages.filter((message) =>
    [message.name, message.email, message.subject, message.message]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await deleteMessage(id);
      fetchMessages();
    } catch {
      setError('Delete failed.');
    }
  };

  if (loading) return <Loader />;

  return (
    <main className="mx-auto max-w-7xl">
      <section className="mb-6 rounded-lg bg-[#182522] p-7 text-white">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">Contact inbox</p>
        <h1 className="text-4xl font-semibold">Contact messages</h1>
        <p className="mt-3 max-w-2xl leading-7 text-stone-300">Review incoming public contact requests from families and visitors.</p>
      </section>

      {error && <ErrorMessage message={error} />}

      <section className="mb-5 rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, email, subject, or message" className="w-full rounded-full border border-stone-200 bg-[#fbf8f3] py-3 pl-12 pr-4 outline-none transition focus:border-teal-900" />
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-stone-50 text-left text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              <tr>
                <th className="px-5 py-4">Sender</th>
                <th className="px-5 py-4">Subject</th>
                <th className="px-5 py-4">Message</th>
                <th className="px-5 py-4">Received</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((message) => (
                <tr key={message.id} className="hover:bg-[#fbf8f3]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#ede4d7] text-teal-950">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-stone-950">{message.name}</p>
                        <p className="text-sm text-stone-500">{message.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-stone-800">{message.subject || '-'}</td>
                  <td className="px-5 py-4"><p className="line-clamp-2 max-w-md text-sm leading-6 text-stone-600">{message.message}</p></td>
                  <td className="px-5 py-4 text-sm text-stone-500">{new Date(message.created_at).toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setViewingMessage(message); setViewModalOpen(true); }} className="rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-950" title="View"><Eye className="h-5 w-5" /></button>
                      <button onClick={() => handleDelete(message.id)} className="rounded-full p-2 text-red-600 hover:bg-red-50" title="Delete"><Trash2 className="h-5 w-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-10 text-center text-stone-500">No messages match this search.</div>}
      </section>

      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Message details">
        {viewingMessage && (
          <div className="space-y-4 text-stone-700">
            <div>
              <h3 className="text-2xl font-semibold text-stone-950">{viewingMessage.name}</h3>
              <p className="text-stone-500">{viewingMessage.email}</p>
              <p className="text-stone-500">{viewingMessage.phone || 'No phone provided'}</p>
            </div>
            <p><strong>Subject:</strong> {viewingMessage.subject || '-'}</p>
            <div className="rounded-lg bg-[#fbf8f3] p-4 leading-7">{viewingMessage.message}</div>
            <p><strong>Received:</strong> {new Date(viewingMessage.created_at).toLocaleString()}</p>
          </div>
        )}
      </Modal>
    </main>
  );
};

export default MessagesAdmin;
