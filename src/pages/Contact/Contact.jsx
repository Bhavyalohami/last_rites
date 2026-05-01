import React, { useState } from 'react';
import { Mail, MapPin, MessageCircleQuestion, Phone, Send } from 'lucide-react';
import { submitContact } from '../../api/publicAPI';
import ErrorMessage from '../../components/common/ErrorMessage';

const faqs = [
  ['What should I do immediately after a death?', 'Call us. We will help you confirm transport, documents, timing, and the first required steps.'],
  ['How much do services cost?', 'Costs depend on service type and family requirements. We give clear pricing before anything is confirmed.'],
  ['Can you support specific traditions?', 'Yes. We coordinate with families, priests, community leaders, and venues to respect the required rites.'],
];

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await submitContact(formData);
      setSuccess('Your message has been sent. We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#f8f3ec] text-stone-900">
      <section className="relative overflow-hidden bg-stone-950 text-white">
        <img src="/memorial-hero.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/78 to-stone-950/20" />
        <div className="relative mx-auto grid min-h-[460px] max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">Contact</p>
            <h1 className="text-5xl font-semibold leading-tight sm:text-6xl">Start with one message or call.</h1>
          </div>
          <p className="max-w-xl text-lg leading-8 text-stone-100">
            You do not need to know exactly what to ask. Tell us what has happened and we will help shape the next step.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div className="rounded-lg border border-stone-200 bg-white p-7 shadow-sm">
          <h2 className="text-3xl font-semibold text-stone-950">Send us a message</h2>
          <p className="mt-3 leading-7 text-stone-600">A coordinator will respond as soon as possible.</p>

          {success && <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{success}</div>}
          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
            {[
              ['name', 'Name *', 'text', true],
              ['email', 'Email *', 'email', true],
              ['phone', 'Phone', 'tel', false],
              ['subject', 'Subject', 'text', false],
            ].map(([name, label, type, required]) => (
              <label key={name} className="block">
                <span className="mb-2 block text-sm font-semibold text-stone-700">{label}</span>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required={required}
                  className="w-full rounded-lg border border-stone-200 bg-[#f8f3ec] px-4 py-3 text-stone-800 outline-none transition focus:border-teal-900"
                />
              </label>
            ))}
            <label className="block sm:col-span-2">
              <span className="mb-2 block text-sm font-semibold text-stone-700">Message *</span>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full rounded-lg border border-stone-200 bg-[#f8f3ec] px-4 py-3 text-stone-800 outline-none transition focus:border-teal-900"
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-6 py-3 font-semibold text-white transition hover:bg-stone-800 disabled:opacity-60 sm:w-fit"
            >
              {loading ? 'Sending...' : 'Send message'}
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg bg-[#182522] p-7 text-white">
            <h2 className="text-3xl font-semibold">Available 24/7</h2>
            <div className="mt-6 space-y-5 text-stone-300">
              <p className="flex gap-3">
                <Phone className="h-5 w-5 flex-none text-amber-200" />
                <span>+91 12345 67890</span>
              </p>
              <p className="flex gap-3">
                <Mail className="h-5 w-5 flex-none text-amber-200" />
                <span>support@lastrites.com</span>
              </p>
              <p className="flex gap-3">
                <MapPin className="h-5 w-5 flex-none text-amber-200" />
                <span>123 Peace Street, Green Park, New Delhi, 110016</span>
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-7 shadow-sm">
            <h2 className="text-2xl font-semibold text-stone-950">Common questions</h2>
            <div className="mt-5 space-y-3">
              {faqs.map(([question, answer]) => (
                <details key={question} className="rounded-lg bg-[#f8f3ec] p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-stone-950">
                    {question}
                    <MessageCircleQuestion className="h-5 w-5 flex-none text-teal-900" />
                  </summary>
                  <p className="mt-3 leading-7 text-stone-600">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default Contact;
