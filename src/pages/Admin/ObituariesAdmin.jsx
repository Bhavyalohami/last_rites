import React, { useEffect, useState } from 'react';
import { CalendarDays, CheckCircle, Edit, Eye, Plus, Search, Trash2, UserRound, XCircle } from 'lucide-react';
import {
  createObituary,
  deleteObituary,
  getAdminObituaries,
  updateObituary,
} from '../../api/adminAPI';
import Button from '../../components/UI/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';
import Modal from '../../components/UI/Modal';

const formInput = 'w-full rounded-lg border border-stone-200 bg-[#fbf8f3] px-4 py-3 outline-none transition focus:border-teal-900';

const emptyForm = {
  name: '',
  photo: '',
  birth_date: '',
  death_date: '',
  description: '',
  place_of_birth: '',
  place_of_death: '',
  funeral_date: '',
  funeral_venue: '',
  survived_by: '',
  achievements: '',
  is_active: true,
};

const dateValue = (value) => (value ? value.split('T')[0] : '');
const displayDate = (value) => (value ? new Date(value).toLocaleDateString() : '-');

const StatusPill = ({ active }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
    active ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-stone-200 bg-stone-100 text-stone-600'
  }`}>
    {active ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
    {active ? 'Active' : 'Inactive'}
  </span>
);

const ObituariesAdmin = () => {
  const [obituaries, setObituaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingObituary, setViewingObituary] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchObituaries = () => {
    setLoading(true);
    getAdminObituaries()
      .then((res) => {
        setObituaries(res.data);
        setError('');
      })
      .catch(() => setError('Failed to load memorials.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchObituaries();
  }, []);

  const filtered = obituaries.filter((obit) =>
    [obit.name, obit.description, obit.place_of_birth, obit.place_of_death]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const handleInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm({ ...form, [event.target.name]: value });
  };

  const openEditModal = (obit) => {
    setEditingId(obit.id);
    setForm({
      name: obit.name,
      photo: obit.photo || '',
      birth_date: dateValue(obit.birth_date),
      death_date: dateValue(obit.death_date),
      description: obit.description || '',
      place_of_birth: obit.place_of_birth || '',
      place_of_death: obit.place_of_death || '',
      funeral_date: dateValue(obit.funeral_date),
      funeral_venue: obit.funeral_venue || '',
      survived_by: obit.survived_by || '',
      achievements: obit.achievements || '',
      is_active: obit.is_active !== false,
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
      if (editingId) await updateObituary(editingId, form);
      else await createObituary(form);
      setModalOpen(false);
      fetchObituaries();
    } catch {
      setError('Operation failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this memorial?')) return;
    try {
      await deleteObituary(id);
      fetchObituaries();
    } catch {
      setError('Delete failed.');
    }
  };

  const handleToggleActive = async (obit) => {
    try {
      await updateObituary(obit.id, { ...obit, is_active: !obit.is_active });
      fetchObituaries();
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
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">Memorials</p>
            <h1 className="text-4xl font-semibold">Manage tribute pages</h1>
            <p className="mt-3 max-w-2xl leading-7 text-stone-300">Create and maintain obituary details, ceremony information, and public visibility.</p>
          </div>
          <Button onClick={openAddModal} className="bg-amber-100 text-stone-950 hover:bg-white">
            <Plus className="h-4 w-4" />
            Add memorial
          </Button>
        </div>
      </section>

      {error && <ErrorMessage message={error} />}

      <section className="mb-5 rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search memorials by name, place, or tribute"
            className="w-full rounded-full border border-stone-200 bg-[#fbf8f3] py-3 pl-12 pr-4 outline-none transition focus:border-teal-900"
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead className="bg-stone-50 text-left text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Life dates</th>
                <th className="px-5 py-4">Funeral</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((obit) => (
                <tr key={obit.id} className="hover:bg-[#fbf8f3]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-[#ede4d7] text-teal-950">
                        {obit.photo ? <img src={obit.photo} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-stone-950">{obit.name}</p>
                        <p className="line-clamp-1 text-sm text-stone-500">{obit.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-stone-600">{displayDate(obit.birth_date)} - {displayDate(obit.death_date)}</td>
                  <td className="px-5 py-4 text-sm text-stone-600">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-teal-900" />
                      {displayDate(obit.funeral_date)}
                    </span>
                  </td>
                  <td className="px-5 py-4"><StatusPill active={obit.is_active !== false} /></td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setViewingObituary(obit); setViewModalOpen(true); }} className="rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-950" title="View"><Eye className="h-5 w-5" /></button>
                      <button onClick={() => openEditModal(obit)} className="rounded-full p-2 text-teal-700 hover:bg-teal-50" title="Edit"><Edit className="h-5 w-5" /></button>
                      <button onClick={() => handleToggleActive(obit)} className="rounded-full p-2 text-amber-700 hover:bg-amber-50" title="Toggle status">{obit.is_active ? <XCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}</button>
                      <button onClick={() => handleDelete(obit.id)} className="rounded-full p-2 text-red-600 hover:bg-red-50" title="Delete"><Trash2 className="h-5 w-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-10 text-center text-stone-500">No memorials match this search.</div>}
      </section>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit memorial' : 'Add memorial'}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">Name *</span><input name="name" value={form.name} onChange={handleInputChange} required className={formInput} /></label>
          <label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">Photo URL</span><input name="photo" value={form.photo} onChange={handleInputChange} className={formInput} /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">Birth date</span><input type="date" name="birth_date" value={form.birth_date} onChange={handleInputChange} className={formInput} /></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">Death date</span><input type="date" name="death_date" value={form.death_date} onChange={handleInputChange} className={formInput} /></label>
          </div>
          <label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">Tribute</span><textarea name="description" value={form.description} onChange={handleInputChange} rows="4" className={formInput} /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">Place of birth</span><input name="place_of_birth" value={form.place_of_birth} onChange={handleInputChange} className={formInput} /></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">Place of death</span><input name="place_of_death" value={form.place_of_death} onChange={handleInputChange} className={formInput} /></label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">Funeral date</span><input type="date" name="funeral_date" value={form.funeral_date} onChange={handleInputChange} className={formInput} /></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">Funeral venue</span><input name="funeral_venue" value={form.funeral_venue} onChange={handleInputChange} className={formInput} /></label>
          </div>
          <label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">Survived by</span><textarea name="survived_by" value={form.survived_by} onChange={handleInputChange} rows="2" className={formInput} /></label>
          <label className="block"><span className="mb-2 block text-sm font-semibold text-stone-700">Achievements</span><textarea name="achievements" value={form.achievements} onChange={handleInputChange} rows="2" className={formInput} /></label>
          <label className="inline-flex items-center gap-2 font-semibold text-stone-700"><input type="checkbox" name="is_active" checked={form.is_active} onChange={handleInputChange} />Active</label>
          <div className="flex justify-end gap-3 pt-2"><Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit">{editingId ? 'Update memorial' : 'Create memorial'}</Button></div>
        </form>
      </Modal>

      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Memorial details">
        {viewingObituary && (
          <div className="space-y-4 text-stone-700">
            {viewingObituary.photo && <img src={viewingObituary.photo} alt={viewingObituary.name} className="h-56 w-full rounded-lg object-cover" />}
            <h3 className="text-2xl font-semibold text-stone-950">{viewingObituary.name}</h3>
            <p className="leading-7">{viewingObituary.description || '-'}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <p><strong>Born:</strong> {displayDate(viewingObituary.birth_date)}</p>
              <p><strong>Died:</strong> {displayDate(viewingObituary.death_date)}</p>
              <p><strong>Birth place:</strong> {viewingObituary.place_of_birth || '-'}</p>
              <p><strong>Death place:</strong> {viewingObituary.place_of_death || '-'}</p>
              <p><strong>Funeral:</strong> {displayDate(viewingObituary.funeral_date)}</p>
              <p><strong>Venue:</strong> {viewingObituary.funeral_venue || '-'}</p>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
};

export default ObituariesAdmin;
