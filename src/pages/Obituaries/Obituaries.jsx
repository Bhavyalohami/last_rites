import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenText, Calendar, Heart, MapPin, Search } from 'lucide-react';
import { getObituaries } from '../../api/publicAPI';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const Obituaries = () => {
  const [obituaries, setObituaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getObituaries()
      .then((res) => setObituaries(res.data))
      .catch(() => setError('Failed to load memorials.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = obituaries.filter((obit) =>
    obit.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main className="bg-[#f8f3ec] text-stone-900">
      <section className="relative overflow-hidden bg-stone-950 text-white">
        <img src="/memorial-hero.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/78 to-stone-950/20" />
        <div className="relative mx-auto grid min-h-[460px] max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">Memorials</p>
            <h1 className="text-5xl font-semibold leading-tight sm:text-6xl">A place for names, dates, and the life between them.</h1>
          </div>
          <p className="max-w-xl text-lg leading-8 text-stone-100">
            Search remembrance pages, read tributes, and return whenever the family wants to remember aloud.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mb-10 max-w-xl">
          <label className="mb-3 block text-sm font-semibold uppercase tracking-[0.22em] text-teal-900" htmlFor="memorial-search">
            Search memorials
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
            <input
              id="memorial-search"
              type="text"
              placeholder="Search by name"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-full border border-stone-200 bg-white py-3 pl-12 pr-4 text-stone-800 shadow-sm outline-none transition focus:border-teal-900"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-stone-200 bg-white p-10 text-center shadow-sm">
            <Heart className="mx-auto mb-4 h-12 w-12 text-stone-300" />
            <p className="text-lg text-stone-500">No memorials found.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((obit) => (
              <Link key={obit.id} to={`/obituaries/${obit.id}`} className="group overflow-hidden rounded-lg bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="aspect-[4/3] overflow-hidden bg-stone-200">
                  <img
                    src={obit.photo || '/memorial-hero.png'}
                    alt={obit.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-stone-950">{obit.name}</h2>
                  {(obit.birth_date || obit.death_date) && (
                    <p className="mt-2 text-sm font-medium text-stone-500">
                      {[formatDate(obit.birth_date), formatDate(obit.death_date)].filter(Boolean).join(' - ')}
                    </p>
                  )}
                  <div className="mt-4 space-y-2 text-xs text-stone-500">
                    {obit.place_of_birth && (
                      <p className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5" />
                        Born: {obit.place_of_birth}
                      </p>
                    )}
                    {obit.funeral_date && (
                      <p className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        Service: {formatDate(obit.funeral_date)}
                      </p>
                    )}
                  </div>
                  <p className="mt-4 line-clamp-3 leading-7 text-stone-600">{obit.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-900">
                    Read tribute
                    <BookOpenText className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-[#ede4d7] py-16">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 sm:px-8 md:flex-row md:items-center lg:px-10">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-teal-900">Create a tribute</p>
            <h2 className="max-w-2xl text-4xl font-semibold leading-tight text-stone-950">Honor a loved one with a page the family can return to.</h2>
          </div>
          <Link to="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-950 px-6 py-3 font-semibold text-white hover:bg-stone-800">
            Contact us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Obituaries;
