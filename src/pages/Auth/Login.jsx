import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn } from 'lucide-react';
import { loginUser } from '../../api/adminAPI';
import useAuth from '../../hooks/useAuth';
import ErrorMessage from '../../components/common/ErrorMessage';

const Login = () => {
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
      const res = await loginUser({ email, password });
      login(res.data.token, res.data.user);
      navigate(res.data.user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
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
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/70 to-stone-950/20" />
        <div className="relative flex h-full flex-col justify-end p-12">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">Last Rites</p>
          <h1 className="max-w-xl text-5xl font-semibold leading-tight">Return to your memorial care dashboard.</h1>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-950">
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
          <div className="rounded-lg border border-stone-200 bg-white p-7 shadow-sm">
            <h2 className="text-3xl font-semibold text-stone-950">Login</h2>
            <p className="mt-2 text-stone-600">Access conversations, memorial requests, and family support.</p>
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
              <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-stone-950 px-6 py-3 font-semibold text-white hover:bg-stone-800 disabled:opacity-60">
                {loading ? 'Logging in...' : 'Login'}
                <LogIn className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-stone-600">
              Do not have an account?{' '}
              <Link to="/register" className="font-semibold text-teal-900 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
