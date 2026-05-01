import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Award, Calendar, Heart, MapPin, Send, Users } from 'lucide-react';
import { getObituaryById } from '../../api/publicAPI';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import assetUrl from '../../utils/assetUrl';

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const ObituaryDetail = () => {
  const { id } = useParams();
  const [obit, setObit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [condolence, setCondolence] = useState('');
  const [condolences, setCondolences] = useState([]);

  useEffect(() => {
    getObituaryById(id)
      .then((res) => {
        setObit(res.data);
        setCondolences([
          { name: 'Priya Sharma', message: 'May their soul rest in peace. My deepest condolences.' },
          { name: 'Rahul Verma', message: 'A beautiful soul. Will be missed dearly.' },
        ]);
      })
      .catch(() => setError('Memorial not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCondolenceSubmit = (event) => {
    event.preventDefault();
    if (condolence.trim()) {
      setCondolences([...condolences, { name: 'You', message: condolence }]);
      setCondolence('');
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main className="bg-[#f8f3ec] text-stone-900">
      <section className="relative overflow-hidden bg-stone-950 text-white">
        <img src={obit.photo || assetUrl('/memorial-hero.png')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/82 to-stone-950/25" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <Link to="/obituaries" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-stone-200 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to memorials
          </Link>
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">In loving memory</p>
            <h1 className="text-5xl font-semibold leading-tight sm:text-6xl">{obit.name}</h1>
            {(obit.birth_date || obit.death_date) && (
              <p className="mt-5 text-xl text-stone-100">
                {[formatDate(obit.birth_date), formatDate(obit.death_date)].filter(Boolean).join(' - ')}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_360px] lg:px-10">
        <article className="rounded-lg border border-stone-200 bg-white p-7 shadow-sm">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">Tribute</p>
          <p className="whitespace-pre-line text-lg leading-9 text-stone-700">{obit.description}</p>

          {(obit.survived_by || obit.achievements) && <div className="my-10 h-px bg-stone-200" />}

          {obit.survived_by && (
            <section className="mb-8">
              <h2 className="mb-3 flex items-center gap-2 text-2xl font-semibold text-stone-950">
                <Users className="h-5 w-5 text-teal-900" />
                Survived by
              </h2>
              <p className="leading-8 text-stone-700">{obit.survived_by}</p>
            </section>
          )}

          {obit.achievements && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-2xl font-semibold text-stone-950">
                <Award className="h-5 w-5 text-teal-900" />
                Achievements
              </h2>
              <p className="whitespace-pre-line leading-8 text-stone-700">{obit.achievements}</p>
            </section>
          )}
        </article>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-lg bg-[#182522] p-6 text-white shadow-sm">
            <Heart className="mb-5 h-7 w-7 text-amber-200" />
            <h2 className="text-2xl font-semibold">Memorial details</h2>
            <div className="mt-6 space-y-4 text-sm text-stone-300">
              {obit.place_of_birth && (
                <p className="flex gap-3">
                  <MapPin className="h-5 w-5 flex-none text-amber-100" />
                  <span><strong className="text-white">Born:</strong> {obit.place_of_birth}</span>
                </p>
              )}
              {obit.place_of_death && (
                <p className="flex gap-3">
                  <MapPin className="h-5 w-5 flex-none text-amber-100" />
                  <span><strong className="text-white">Passed:</strong> {obit.place_of_death}</span>
                </p>
              )}
              {obit.funeral_date && (
                <p className="flex gap-3">
                  <Calendar className="h-5 w-5 flex-none text-amber-100" />
                  <span><strong className="text-white">Service:</strong> {formatDate(obit.funeral_date)}</span>
                </p>
              )}
              {obit.funeral_venue && (
                <p className="flex gap-3">
                  <MapPin className="h-5 w-5 flex-none text-amber-100" />
                  <span><strong className="text-white">Venue:</strong> {obit.funeral_venue}</span>
                </p>
              )}
            </div>
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-16 sm:px-8 lg:px-10">
        <div className="rounded-lg border border-stone-200 bg-white p-7 shadow-sm">
          <h2 className="text-3xl font-semibold text-stone-950">Leave a condolence</h2>
          <form onSubmit={handleCondolenceSubmit} className="mt-6">
            <textarea
              value={condolence}
              onChange={(event) => setCondolence(event.target.value)}
              placeholder="Write your message here..."
              rows="4"
              className="w-full rounded-lg border border-stone-200 bg-[#f8f3ec] px-4 py-3 text-stone-800 outline-none transition focus:border-teal-900"
              required
            />
            <button type="submit" className="mt-4 inline-flex items-center gap-2 rounded-full bg-stone-950 px-6 py-3 font-semibold text-white hover:bg-stone-800">
              Post condolence
              <Send className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-10 space-y-4">
            <h3 className="text-xl font-semibold text-stone-950">Condolences ({condolences.length})</h3>
            {condolences.map((item, index) => (
              <div key={`${item.name}-${index}`} className="rounded-lg bg-[#f8f3ec] p-5">
                <p className="font-semibold text-stone-950">{item.name}</p>
                <p className="mt-2 leading-7 text-stone-700">{item.message}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ObituaryDetail;
