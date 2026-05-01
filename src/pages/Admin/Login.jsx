import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import { adminLogin } from '../../api/adminAPI';
import useAuth from '../../hooks/useAuth';
import ErrorMessage from '../../components/common/ErrorMessage';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await adminLogin({ email, password });
      login(res.data.token, res.data.user);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-[#f8f3ec] text-stone-900 lg:grid-cols-[1fr_0.9fr]">
      <section className="relative hidden overflow-hidden bg-stone-950 text-white lg:block">
        <img src="/memorial-hero.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/72 to-stone-950/20" />
        <div className="relative flex h-full flex-col justify-end p-12">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">Admin</p>
          <h1 className="max-w-xl text-5xl font-semibold leading-tight">Manage memorial care with clarity.</h1>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-7 shadow-sm">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#ede4d7] text-teal-950">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-semibold text-stone-950">Admin login</h1>
          <p className="mt-2 text-stone-600">Access services, tributes, messages, and settings.</p>
          {error && <ErrorMessage message={error} />}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-stone-700">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-lg border border-stone-200 bg-[#f8f3ec] px-4 py-3 outline-none transition focus:border-teal-900"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-stone-700">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-lg border border-stone-200 bg-[#f8f3ec] px-4 py-3 outline-none transition focus:border-teal-900"
              />
            </label>
            <button type="submit" disabled={loading} className="w-full rounded-full bg-stone-950 px-6 py-3 font-semibold text-white hover:bg-stone-800 disabled:opacity-60">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default AdminLogin;
