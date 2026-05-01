import React, { useEffect, useState } from 'react';
import { CheckCircle, Edit, Eye, Plus, Search, Star, Trash2, XCircle } from 'lucide-react';
import {
  createTestimonial,
  deleteTestimonial,
  getAdminTestimonials,
  updateTestimonial,
} from '../../api/adminAPI';
import Button from '../../components/UI/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import Modal from '../../components/UI/Modal';

const formInput = 'w-full rounded-lg border border-stone-200 bg-[#fbf8f3] px-4 py-3 outline-none transition focus:border-teal-900';
const emptyForm = { name: '', message: '', rating: 5, relation: '', is_featured: false, is_active: true };

const Pill = ({ active, children }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
    active ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-stone-200 bg-stone-100 text-stone-600'
  }`}>
    {active ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
    {children || (active ? 'Active' : 'Inactive')}
  </span>
);

const TestimonialsAdmin = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingTestimonial, setViewingTestimonial] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchTestimonials = () => {
    setLoading(true);
    getAdminTestimonials()
      .then((res) => {
        setTestimonials(res.data);
        setError('');
      })
      .catch(() => setError('Failed to load testimonials.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const filtered = testimonials.filter((item) =>
    [item.name, item.message, item.relation].filter(Boolean).join(' ').toLowerCase().includes(query.toLowerCase())
  );

  const handleInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm({ ...form, [event.target.name]: value });
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      message: item.message,
      rating: item.rating || 5,
      relation: item.relation || '',
      is_featured: Boolean(item.is_featured),
      is_active: item.is_active !== false,
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
      if (editingId) await updateTestimonial(editingId, form);
      else await createTestimonial(form);
      setModalOpen(false);
      fetchTestimonials();
    } catch {
      setError('Operation failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await deleteTestimonial(id);
      fetchTestimonials();
    } catch {
      setError('Delete failed.');
    }
  };

  if (loading) return <Loader />;

  return (
    <main className="mx-auto max-w-7xl">
      <section className="mb-6 rounded-lg bg-[#182522] p-7 text-white">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">Testimonials</p>
            <h1 className="text-4xl font-semibold">Manage family voices</h1>
            <p className="mt-3 max-w-2xl leading-7 text-stone-300">Curate public feedback and featured family stories.</p>
          </div>
          <Button onClick={openAddModal} className="bg-amber-100 text-stone-950 hover:bg-white">
            <Plus className="h-4 w-4" />
            Add testimonial
          </Button>
        </div>
      </section>

      {error && <ErrorMessage message={error} />}

      <section className="mb-5 rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search testimonials" className="w-full rounded-full border border-stone-200 bg-[#fbf8f3] py-3 pl-12 pr-4 outline-none transition focus:border-teal-900" />
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead className="bg-stone-50 text-left text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              <tr>
                <th className="px-5 py-4">Family member</th>
                <th className="px-5 py-4">Message</th>
                <th className="px-5 py-4">Rating</th>
                <th className="px-5 py-4">Featured</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#fbf8f3]">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-stone-950">{item.name}</p>
                    <p className="text-sm text-stone-500">{item.relation || 'Family member'}</p>
                  </td>
                  <td className="px-5 py-4"><p className="line-clamp-2 max-w-md text-sm leading-6 text-stone-600">{item.message}</p></td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
                      <Star className="h-4 w-4 fill-current" />
                      {item.rating || '-'}
                    </span>
                  </td>
                  <td className="px-5 py-4"><Pill active={Boolean(item.is_featured)}>{item.is_featured ? 'Featured' : 'Standard'}</Pill></td>
                  <td className="px-5 py-4"><Pill active={item.is_active !== false} /></td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setViewingTestimonial(item); setViewModalOpen(true); }} className="rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-950" title="View"><Eye className="h-5 w-5" /></button>
                      <button onClick={() => openEditModal(item)} className="rounded-full p-2 text-teal-700 hover:bg-teal-50" title="Edit"><Edit className="h-5 w-5" /></button>
                      <button onClick={() => handleDelete(item.id)} className="rounded-full p-2 text-red-600 hover:bg-red-50" title="Delete"><Trash2 className="h-5 w-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-10 text-center text-stone-500">No testimonials match this search.</div>}
      </section>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit testimonial' : 'Add testimonial'}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">Name *</span><input name="name" value={form.name} onChange={handleInputChange} required className={formInput} /></label>
          <label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">Message *</span><textarea name="message" value={form.message} onChange={handleInputChange} required rows="4" className={formInput} /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">Rating</span><input type="number" name="rating" value={form.rating} onChange={handleInputChange} min="1" max="5" className={formInput} /></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">Relation</span><input name="relation" value={form.relation} onChange={handleInputChange} className={formInput} /></label>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 font-semibold text-stone-700"><input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleInputChange} />Featured</label>
            <label className="inline-flex items-center gap-2 font-semibold text-stone-700"><input type="checkbox" name="is_active" checked={form.is_active} onChange={handleInputChange} />Active</label>
          </div>
          <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit">{editingId ? 'Update testimonial' : 'Create testimonial'}</Button></div>
        </form>
      </Modal>

      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Testimonial details">
        {viewingTestimonial && (
          <div className="space-y-4 text-stone-700">
            <h3 className="text-2xl font-semibold text-stone-950">{viewingTestimonial.name}</h3>
            <p className="leading-7">{viewingTestimonial.message}</p>
            <p><strong>Rating:</strong> {viewingTestimonial.rating || '-'}</p>
            <p><strong>Relation:</strong> {viewingTestimonial.relation || '-'}</p>
          </div>
        )}
      </Modal>
    </main>
  );
};

export default TestimonialsAdmin;
