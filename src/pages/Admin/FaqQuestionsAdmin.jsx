import React, { useEffect, useState } from 'react';
import { CheckCircle, Edit, Eye, FileQuestion, Plus, Search, Trash2, XCircle } from 'lucide-react';
import {
  createFaqQuestion,
  deleteFaqQuestion,
  getAdminFaqCategories,
  getAdminFaqQuestions,
  updateFaqQuestion,
} from '../../api/adminAPI';
import Button from '../../components/UI/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import Modal from '../../components/UI/Modal';

const formInput = 'w-full rounded-lg border border-stone-200 bg-[#fbf8f3] px-4 py-3 outline-none transition focus:border-teal-900';
const emptyForm = { category_id: '', question: '', answer: '', display_order: 0, is_active: true };

const StatusPill = ({ active }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${active ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-stone-200 bg-stone-100 text-stone-600'}`}>
    {active ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
    {active ? 'Active' : 'Inactive'}
  </span>
);

const FaqQuestionsAdmin = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingQuestion, setViewingQuestion] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchData = () => {
    setLoading(true);
    Promise.all([getAdminFaqQuestions(), getAdminFaqCategories()])
      .then(([questionsRes, categoriesRes]) => {
        setQuestions(questionsRes.data);
        setCategories(categoriesRes.data);
        setError('');
      })
      .catch(() => setError('Failed to load FAQ data.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = questions.filter((item) =>
    [item.category_name, item.question, item.answer].filter(Boolean).join(' ').toLowerCase().includes(query.toLowerCase())
  );

  const handleInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm({ ...form, [event.target.name]: value });
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setForm({
      category_id: item.category_id,
      question: item.question,
      answer: item.answer,
      display_order: item.display_order,
      is_active: item.is_active,
    });
    setModalOpen(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm({ ...emptyForm, category_id: categories[0]?.id || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) await updateFaqQuestion(editingId, form);
      else await createFaqQuestion(form);
      setModalOpen(false);
      fetchData();
    } catch {
      setError('Operation failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await deleteFaqQuestion(id);
      fetchData();
    } catch {
      setError('Delete failed.');
    }
  };

  const handleToggleActive = async (item) => {
    try {
      await updateFaqQuestion(item.id, { ...item, is_active: !item.is_active });
      fetchData();
    } catch {
      setError('Status update failed.');
    }
  };

  if (loading) return <Loader />;

  return (
    <main className="mx-auto max-w-7xl">
      <section className="mb-6 rounded-lg bg-[#182522] p-7 text-white">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">FAQ questions</p>
            <h1 className="text-4xl font-semibold">Manage support answers</h1>
            <p className="mt-3 max-w-2xl leading-7 text-stone-300">Edit the guided answers surfaced in the family FAQ assistant.</p>
          </div>
          <Button onClick={openAddModal} className="bg-amber-100 text-stone-950 hover:bg-white"><Plus className="h-4 w-4" />Add question</Button>
        </div>
      </section>

      {error && <ErrorMessage message={error} />}

      <section className="mb-5 rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-xl"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search questions and answers" className="w-full rounded-full border border-stone-200 bg-[#fbf8f3] py-3 pl-12 pr-4 outline-none transition focus:border-teal-900" /></div>
      </section>

      <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-stone-50 text-left text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              <tr><th className="px-5 py-4">Question</th><th className="px-5 py-4">Category</th><th className="px-5 py-4">Order</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#fbf8f3]">
                  <td className="px-5 py-4"><div className="flex items-start gap-3"><div className="mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-[#ede4d7] text-teal-950"><FileQuestion className="h-5 w-5" /></div><div><p className="font-semibold text-stone-950">{item.question}</p><p className="line-clamp-2 text-sm leading-6 text-stone-500">{item.answer}</p></div></div></td>
                  <td className="px-5 py-4 text-sm font-semibold text-stone-700">{item.category_name}</td>
                  <td className="px-5 py-4 text-sm text-stone-600">{item.display_order}</td>
                  <td className="px-5 py-4"><StatusPill active={item.is_active} /></td>
                  <td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => { setViewingQuestion(item); setViewModalOpen(true); }} className="rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-950" title="View"><Eye className="h-5 w-5" /></button><button onClick={() => openEditModal(item)} className="rounded-full p-2 text-teal-700 hover:bg-teal-50" title="Edit"><Edit className="h-5 w-5" /></button><button onClick={() => handleToggleActive(item)} className="rounded-full p-2 text-amber-700 hover:bg-amber-50" title="Toggle status">{item.is_active ? <XCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}</button><button onClick={() => handleDelete(item.id)} className="rounded-full p-2 text-red-600 hover:bg-red-50" title="Delete"><Trash2 className="h-5 w-5" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-10 text-center text-stone-500">No questions match this search.</div>}
      </section>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit question' : 'Add question'}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">Category *</span><select name="category_id" value={form.category_id} onChange={handleInputChange} required className={formInput}><option value="">Select a category</option>{categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}</select></label>
          <label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">Question *</span><textarea name="question" value={form.question} onChange={handleInputChange} required rows="3" className={formInput} /></label>
          <label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">Answer *</span><textarea name="answer" value={form.answer} onChange={handleInputChange} required rows="5" className={formInput} /></label>
          <div className="grid gap-4 sm:grid-cols-2"><label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">Display order</span><input type="number" name="display_order" value={form.display_order} onChange={handleInputChange} className={formInput} /></label><label className="inline-flex items-end gap-2 pb-3 font-semibold text-stone-700"><input type="checkbox" name="is_active" checked={form.is_active} onChange={handleInputChange} />Active</label></div>
          <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit">{editingId ? 'Update question' : 'Create question'}</Button></div>
        </form>
      </Modal>

      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Question details">
        {viewingQuestion && <div className="space-y-4 text-stone-700"><p><strong>Category:</strong> {viewingQuestion.category_name}</p><h3 className="text-2xl font-semibold text-stone-950">{viewingQuestion.question}</h3><div className="rounded-lg bg-[#fbf8f3] p-4 leading-7">{viewingQuestion.answer}</div><p><strong>Order:</strong> {viewingQuestion.display_order}</p><p><strong>Status:</strong> {viewingQuestion.is_active ? 'Active' : 'Inactive'}</p></div>}
      </Modal>
    </main>
  );
};

export default FaqQuestionsAdmin;
