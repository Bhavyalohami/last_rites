import React, { useEffect, useState } from 'react';
import { CheckCircle, Edit, Eye, HelpCircle, Plus, Search, Trash2, XCircle } from 'lucide-react';
import {
  createFaqCategory,
  deleteFaqCategory,
  getAdminFaqCategories,
  updateFaqCategory,
} from '../../api/adminAPI';
import Button from '../../components/UI/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import Modal from '../../components/UI/Modal';

const formInput = 'w-full rounded-lg border border-stone-200 bg-[#fbf8f3] px-4 py-3 outline-none transition focus:border-teal-900';
const emptyForm = { name: '', description: '', icon: '', display_order: 0, is_active: true };

const StatusPill = ({ active }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${active ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-stone-200 bg-stone-100 text-stone-600'}`}>
    {active ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
    {active ? 'Active' : 'Inactive'}
  </span>
);

const FaqCategoriesAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingCategory, setViewingCategory] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchCategories = () => {
    setLoading(true);
    getAdminFaqCategories()
      .then((res) => {
        setCategories(res.data);
        setError('');
      })
      .catch(() => setError('Failed to load categories.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filtered = categories.filter((cat) =>
    [cat.name, cat.description].filter(Boolean).join(' ').toLowerCase().includes(query.toLowerCase())
  );

  const handleInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm({ ...form, [event.target.name]: value });
  };

  const openEditModal = (cat) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      description: cat.description || '',
      icon: cat.icon || '',
      display_order: cat.display_order,
      is_active: cat.is_active,
    });
    setModalOpen(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) await updateFaqCategory(editingId, form);
      else await createFaqCategory(form);
      setModalOpen(false);
      fetchCategories();
    } catch {
      setError('Operation failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category and its questions?')) return;
    try {
      await deleteFaqCategory(id);
      fetchCategories();
    } catch {
      setError('Delete failed.');
    }
  };

  const handleToggleActive = async (cat) => {
    try {
      await updateFaqCategory(cat.id, { ...cat, is_active: !cat.is_active });
      fetchCategories();
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
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">FAQ categories</p>
            <h1 className="text-4xl font-semibold">Organize support topics</h1>
            <p className="mt-3 max-w-2xl leading-7 text-stone-300">Group FAQ guidance into clear categories for families.</p>
          </div>
          <Button onClick={openAddModal} className="bg-amber-100 text-stone-950 hover:bg-white"><Plus className="h-4 w-4" />Add category</Button>
        </div>
      </section>

      {error && <ErrorMessage message={error} />}

      <section className="mb-5 rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-xl"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search categories" className="w-full rounded-full border border-stone-200 bg-[#fbf8f3] py-3 pl-12 pr-4 outline-none transition focus:border-teal-900" /></div>
      </section>

      <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-stone-50 text-left text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              <tr><th className="px-5 py-4">Category</th><th className="px-5 py-4">Description</th><th className="px-5 py-4">Order</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#fbf8f3]">
                  <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#ede4d7] text-teal-950">{cat.icon || <HelpCircle className="h-5 w-5" />}</div><p className="font-semibold text-stone-950">{cat.name}</p></div></td>
                  <td className="px-5 py-4"><p className="line-clamp-2 max-w-md text-sm leading-6 text-stone-600">{cat.description || '-'}</p></td>
                  <td className="px-5 py-4 text-sm font-semibold text-stone-700">{cat.display_order}</td>
                  <td className="px-5 py-4"><StatusPill active={cat.is_active} /></td>
                  <td className="px-5 py-4"><div className="flex justify-end gap-2"><button onClick={() => { setViewingCategory(cat); setViewModalOpen(true); }} className="rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-950" title="View"><Eye className="h-5 w-5" /></button><button onClick={() => openEditModal(cat)} className="rounded-full p-2 text-teal-700 hover:bg-teal-50" title="Edit"><Edit className="h-5 w-5" /></button><button onClick={() => handleToggleActive(cat)} className="rounded-full p-2 text-amber-700 hover:bg-amber-50" title="Toggle status">{cat.is_active ? <XCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}</button><button onClick={() => handleDelete(cat.id)} className="rounded-full p-2 text-red-600 hover:bg-red-50" title="Delete"><Trash2 className="h-5 w-5" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-10 text-center text-stone-500">No categories match this search.</div>}
      </section>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit category' : 'Add category'}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">Name *</span><input name="name" value={form.name} onChange={handleInputChange} required className={formInput} /></label>
          <label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">Description</span><textarea name="description" value={form.description} onChange={handleInputChange} rows="3" className={formInput} /></label>
          <div className="grid gap-4 sm:grid-cols-2"><label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">Icon</span><input name="icon" value={form.icon} onChange={handleInputChange} className={formInput} /></label><label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">Order</span><input type="number" name="display_order" value={form.display_order} onChange={handleInputChange} className={formInput} /></label></div>
          <label className="inline-flex items-center gap-2 font-semibold text-stone-700"><input type="checkbox" name="is_active" checked={form.is_active} onChange={handleInputChange} />Active</label>
          <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit">{editingId ? 'Update category' : 'Create category'}</Button></div>
        </form>
      </Modal>

      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Category details">
        {viewingCategory && <div className="space-y-3 text-stone-700"><h3 className="text-2xl font-semibold text-stone-950">{viewingCategory.name}</h3><p>{viewingCategory.description || '-'}</p><p><strong>Icon:</strong> {viewingCategory.icon || '-'}</p><p><strong>Order:</strong> {viewingCategory.display_order}</p><p><strong>Status:</strong> {viewingCategory.is_active ? 'Active' : 'Inactive'}</p></div>}
      </Modal>
    </main>
  );
};

export default FaqCategoriesAdmin;
