import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { registerUser } from '../../api/adminAPI';
import useAuth from '../../hooks/useAuth';
import ErrorMessage from '../../components/common/ErrorMessage';
import assetUrl from '../../utils/assetUrl';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await registerUser(formData);
      login(res.data.token, res.data.user);
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-[#f8f3ec] text-stone-900 lg:grid-cols-[1fr_0.9fr]">
      <section className="relative hidden overflow-hidden bg-stone-950 text-white lg:block">
        <img src={assetUrl('/memorial-hero.png')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/70 to-stone-950/20" />
        <div className="relative flex h-full flex-col justify-end p-12">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">Last Rites</p>
          <h1 className="max-w-xl text-5xl font-semibold leading-tight">Create a space for care, questions, and remembrance.</h1>
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-stone-600 hover:text-stone-950">
            <ArrowLeft className="h-4 w-4" />
            Back home
          </Link>
          <div className="rounded-lg border border-stone-200 bg-white p-7 shadow-sm">
            <h2 className="text-3xl font-semibold text-stone-950">Register</h2>
            <p className="mt-2 text-stone-600">Start a private support account for family conversations.</p>
            {error && <ErrorMessage message={error} />}
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {[
                ['name', 'Full name', 'text', true],
                ['email', 'Email', 'email', true],
                ['password', 'Password', 'password', true],
                ['phone', 'Phone', 'tel', false],
              ].map(([name, label, type, required]) => (
                <label key={name} className="block">
                  <span className="mb-2 block text-sm font-semibold text-stone-700">{label}{name === 'password' ? ' (min. 6 characters)' : ''}</span>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required={required}
                    minLength={name === 'password' ? 6 : undefined}
                    className="w-full rounded-lg border border-stone-200 bg-[#f8f3ec] px-4 py-3 outline-none transition focus:border-teal-900"
                  />
                </label>
              ))}
              <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-stone-950 px-6 py-3 font-semibold text-white hover:bg-stone-800 disabled:opacity-60">
                {loading ? 'Registering...' : 'Register'}
                <UserPlus className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-stone-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-teal-900 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;
