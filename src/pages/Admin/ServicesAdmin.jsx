import React, { useEffect, useState } from 'react';
import {
  CheckCircle,
  Edit,
  Eye,
  IndianRupee,
  Package,
  Plus,
  Search,
  Trash2,
  XCircle,
} from 'lucide-react';
import {
  createService,
  deleteService,
  getAdminServices,
  updateService,
} from '../../api/adminAPI';
import Modal from '../../components/UI/Modal';
import Button from '../../components/UI/Button';

const emptyForm = {
  title: '',
  description: '',
  price: '',
  image: '',
  category: '',
  duration: '',
  is_featured: false,
  is_active: true,
};

const formInput = 'w-full rounded-lg border border-stone-200 bg-[#fbf8f3] px-4 py-3 outline-none transition focus:border-teal-900';

const formatPrice = (price) => {
  const num = parseFloat(price);
  if (Number.isNaN(num)) return price;
  return num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

const StatusPill = ({ active }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
    active ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-stone-200 bg-stone-100 text-stone-600'
  }`}>
    {active ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
    {active ? 'Active' : 'Inactive'}
  </span>
);

const ServicesAdmin = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingService, setViewingService] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchServices = () => {
    setLoading(true);
    getAdminServices()
      .then((res) => {
        setServices(res.data);
        setError('');
      })
      .catch(() => setError('Failed to load services.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const filtered = services.filter((service) =>
    [service.title, service.category, service.description]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const handleInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm({ ...form, [event.target.name]: value });
  };

  const openEditModal = (service) => {
    setEditingId(service.id);
    setForm({
      title: service.title,
      description: service.description || '',
      price: service.price || '',
      image: service.image || '',
      category: service.category || '',
      duration: service.duration || '',
      is_featured: Boolean(service.is_featured),
      is_active: service.is_active !== false,
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
      if (editingId) await updateService(editingId, form);
      else await createService(form);
      setModalOpen(false);
      fetchServices();
    } catch {
      setError('Operation failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await deleteService(id);
      fetchServices();
    } catch {
      setError('Delete failed.');
    }
  };

  const handleToggleActive = async (service) => {
    try {
      await updateService(service.id, { ...service, is_active: !service.is_active });
      fetchServices();
    } catch {
      setError('Status update failed.');
    }
  };

  if (loading) {
    return <div className="h-64 animate-pulse rounded-lg bg-stone-200" />;
  }

  return (
    <main className="mx-auto max-w-7xl">
      <section className="mb-6 rounded-lg bg-[#182522] p-7 text-white">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">Services</p>
            <h1 className="text-4xl font-semibold">Manage ritual care services</h1>
            <p className="mt-3 max-w-2xl leading-7 text-stone-300">
              Maintain service details, visibility, pricing, and featured offerings.
            </p>
          </div>
          <Button onClick={openAddModal} className="bg-amber-100 text-stone-950 hover:bg-white">
            <Plus className="h-4 w-4" />
            Add service
          </Button>
        </div>
      </section>

      {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}

      <section className="mb-5 rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search services by title, category, or description"
            className="w-full rounded-full border border-stone-200 bg-[#fbf8f3] py-3 pl-12 pr-4 outline-none transition focus:border-teal-900"
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-stone-50 text-left text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              <tr>
                <th className="px-5 py-4">Service</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Featured</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((service) => (
                <tr key={service.id} className="hover:bg-[#fbf8f3]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#ede4d7] text-teal-950">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-stone-950">{service.title}</p>
                        <p className="line-clamp-1 text-sm text-stone-500">{service.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-stone-600">{service.category || '-'}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-stone-950">
                    {service.price ? (
                      <span className="inline-flex items-center gap-1">
                        <IndianRupee className="h-4 w-4" />
                        {formatPrice(service.price)}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill active={Boolean(service.is_featured)} />
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill active={service.is_active !== false} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setViewingService(service); setViewModalOpen(true); }} className="rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-950" title="View">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button onClick={() => openEditModal(service)} className="rounded-full p-2 text-teal-700 hover:bg-teal-50" title="Edit">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleToggleActive(service)} className="rounded-full p-2 text-amber-700 hover:bg-amber-50" title="Toggle status">
                        {service.is_active ? <XCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                      </button>
                      <button onClick={() => handleDelete(service.id)} className="rounded-full p-2 text-red-600 hover:bg-red-50" title="Delete">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-10 text-center text-stone-500">No services match this search.</div>
        )}
      </section>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit service' : 'Add service'}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-stone-700">Title *</span>
            <input name="title" value={form.title} onChange={handleInputChange} required className={formInput} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-stone-700">Description</span>
            <textarea name="description" value={form.description} onChange={handleInputChange} rows="4" className={formInput} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-stone-700">Price</span>
              <input name="price" value={form.price} onChange={handleInputChange} className={formInput} />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-stone-700">Category</span>
              <input name="category" value={form.category} onChange={handleInputChange} className={formInput} />
            </label>
          </div>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-stone-700">Duration</span>
            <input name="duration" value={form.duration} onChange={handleInputChange} className={formInput} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-stone-700">Image URL</span>
            <input name="image" value={form.image} onChange={handleInputChange} className={formInput} />
          </label>
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 font-semibold text-stone-700">
              <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleInputChange} />
              Featured
            </label>
            <label className="inline-flex items-center gap-2 font-semibold text-stone-700">
              <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleInputChange} />
              Active
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingId ? 'Update service' : 'Create service'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} title="Service details">
        {viewingService && (
          <div className="space-y-4 text-stone-700">
            {viewingService.image && <img src={viewingService.image} alt={viewingService.title} className="h-56 w-full rounded-lg object-cover" />}
            <h3 className="text-2xl font-semibold text-stone-950">{viewingService.title}</h3>
            <p className="leading-7">{viewingService.description || '-'}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <p><strong>Price:</strong> {viewingService.price ? `Rs. ${formatPrice(viewingService.price)}` : '-'}</p>
              <p><strong>Category:</strong> {viewingService.category || '-'}</p>
              <p><strong>Duration:</strong> {viewingService.duration || '-'}</p>
              <p><strong>Status:</strong> {viewingService.is_active ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
};

export default ServicesAdmin;
