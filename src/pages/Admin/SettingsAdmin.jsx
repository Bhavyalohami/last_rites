import React, { useEffect, useState } from 'react';
import { Palette, Save, Type } from 'lucide-react';
import { getAdminSettings, updateSettings } from '../../api/adminAPI';
import Button from '../../components/UI/Button';
import ErrorMessage from '../../components/common/ErrorMessage';
import Loader from '../../components/common/Loader';

const formInput = 'w-full rounded-lg border border-stone-200 bg-[#fbf8f3] px-4 py-3 outline-none transition focus:border-teal-900';

const SettingsAdmin = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getAdminSettings()
      .then((res) => setSettings(res.data))
      .catch(() => setError('Failed to load settings.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await updateSettings(settings);
      setSuccess('Settings updated successfully.');
    } catch {
      setError('Update failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <main className="mx-auto max-w-5xl">
      <section className="mb-6 rounded-lg bg-[#182522] p-7 text-white">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">Settings</p>
        <h1 className="text-4xl font-semibold">Theme and presentation</h1>
        <p className="mt-3 max-w-2xl leading-7 text-stone-300">
          Tune the public site colors and typography without touching code.
        </p>
      </section>

      {error && <ErrorMessage message={error} />}
      {success && <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">{success}</div>}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#ede4d7] text-teal-950">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-stone-950">Color system</h2>
              <p className="text-sm text-stone-500">Choose the primary and secondary theme colors.</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-stone-700">Primary color</span>
              <input
                type="color"
                value={settings.primary_color || '#1f3f3a'}
                onChange={(event) => handleChange('primary_color', event.target.value)}
                className="h-14 w-full rounded-lg border border-stone-200 bg-white p-1"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-stone-700">Secondary color</span>
              <input
                type="color"
                value={settings.secondary_color || '#ede4d7'}
                onChange={(event) => handleChange('secondary_color', event.target.value)}
                className="h-14 w-full rounded-lg border border-stone-200 bg-white p-1"
              />
            </label>
          </div>
        </section>

        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#ede4d7] text-teal-950">
              <Type className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-stone-950">Typography</h2>
              <p className="text-sm text-stone-500">Select heading and body fonts.</p>
            </div>
          </div>
          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-stone-700">Heading font</span>
              <select value={settings.font_heading || 'Georgia'} onChange={(event) => handleChange('font_heading', event.target.value)} className={formInput}>
                <option>Georgia</option>
                <option>Playfair Display</option>
                <option>Merriweather</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-stone-700">Body font</span>
              <select value={settings.font_body || 'Inter'} onChange={(event) => handleChange('font_body', event.target.value)} className={formInput}>
                <option>Inter</option>
                <option>Open Sans</option>
                <option>Raleway</option>
                <option>Roboto</option>
              </select>
            </label>
          </div>
        </section>

        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold text-stone-950">Preview</h2>
            <p className="text-sm text-stone-500">A quick approximation of the current public theme.</p>
          </div>
          <div className="rounded-lg p-6 text-white" style={{ backgroundColor: settings.primary_color || '#1f3f3a' }}>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: settings.secondary_color || '#ede4d7' }}>
              Last Rites
            </p>
            <h3 className="text-3xl font-semibold" style={{ fontFamily: settings.font_heading || 'Georgia' }}>
              A life remembered with dignity.
            </h3>
            <p className="mt-3 max-w-xl leading-7" style={{ fontFamily: settings.font_body || 'Inter' }}>
              Compassionate memorial care, practical coordination, and family support.
            </p>
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </section>
      </form>
    </main>
  );
};

export default SettingsAdmin;
