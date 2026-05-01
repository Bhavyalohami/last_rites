import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  FileCheck2,
  Flame,
  HeartHandshake,
  Phone,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { getServices, getTestimonials, getObituaries } from '../../api/publicAPI';
import Button from '../../components/UI/Button';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const supportSteps = [
  {
    icon: Phone,
    title: 'Immediate guidance',
    copy: 'A calm first call to understand what has happened and what needs to be arranged now.',
  },
  {
    icon: FileCheck2,
    title: 'Documents and rituals',
    copy: 'Coordination for rites, cremation, certificates, transport, priests, and family requirements.',
  },
  {
    icon: HeartHandshake,
    title: 'Aftercare for family',
    copy: 'Tributes, remembrance pages, grief resources, and continued support after the ceremony.',
  },
];

const memoryNotes = [
  'A tribute page for stories, photos, and dates',
  'Clear service planning without confusing steps',
  'Respect for traditions, faith, and family wishes',
];

const formatDate = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const Home = () => {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [obituaries, setObituaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getServices(), getTestimonials(), getObituaries()])
      .then(([servicesRes, testimonialsRes, obitsRes]) => {
        setServices(servicesRes.data.slice(0, 3));
        setTestimonials(testimonialsRes.data.slice(0, 2));
        setObituaries(obitsRes.data.slice(0, 3));
      })
      .catch(() => setError('Failed to load memorial content.'))
      .finally(() => setLoading(false));
  }, []);

  const featuredService = useMemo(() => services[0], [services]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main className="bg-[#f8f3ec] text-stone-900">
      <section className="relative min-h-[calc(100vh-88px)] overflow-hidden">
        <img
          src="/memorial-hero.png"
          alt="A quiet riverside memorial with lamps, petals, and dawn light"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#17130f]/90 via-[#17130f]/58 to-[#17130f]/8" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f8f3ec] to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl items-center px-5 py-16 sm:px-8 lg:px-10">
          <div className="max-w-2xl text-white">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-md">
              <Flame className="h-4 w-4 text-amber-200" />
              Memorial care, last rites, and family guidance
            </div>
            <h1 className="max-w-xl text-5xl font-semibold leading-[0.98] tracking-normal sm:text-6xl lg:text-7xl">
              A life remembered with dignity.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-100 sm:text-xl">
              Last Rites helps families plan the farewell, preserve memories, and move through the first hard hours with steady, human support.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/contact">
                <Button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-100 px-6 py-3 font-semibold text-stone-950 hover:bg-white sm:w-auto">
                  Get support now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/obituaries">
                <button className="inline-flex w-full items-center justify-center rounded-full border border-white/35 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-white/20 sm:w-auto">
                  Visit memorials
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
            What this is
          </p>
          <h2 className="text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
            A memorial website that feels like a hand on the shoulder.
          </h2>
        </div>
        <div className="grid gap-4 text-stone-700 sm:grid-cols-3">
          {memoryNotes.map((note) => (
            <div key={note} className="rounded-lg border border-stone-200 bg-white/65 p-5 shadow-sm">
              <Sparkles className="mb-4 h-5 w-5 text-amber-700" />
              <p className="text-sm leading-6">{note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#182522] py-16 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">
                How we carry the day
              </p>
              <h2 className="max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
                From the first call to the final prayer, each step is made clear.
              </h2>
            </div>
            <Link to="/services" className="inline-flex items-center gap-2 font-semibold text-amber-100 hover:text-white">
              See all services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {supportSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="rounded-lg border border-white/10 bg-white/[0.06] p-6">
                  <div className="mb-8 flex items-center justify-between">
                    <Icon className="h-8 w-8 text-amber-200" />
                    <span className="text-sm text-white/45">0{index + 1}</span>
                  </div>
                  <h3 className="mb-3 text-2xl font-semibold">{step.title}</h3>
                  <p className="leading-7 text-stone-300">{step.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
            Services
          </p>
          <h2 className="text-4xl font-semibold leading-tight text-stone-950">
            Ritual care with practical coordination.
          </h2>
          {featuredService && (
            <div className="mt-8 rounded-lg bg-stone-950 p-6 text-white">
              <ShieldCheck className="mb-5 h-8 w-8 text-amber-200" />
              <h3 className="text-2xl font-semibold">{featuredService.title}</h3>
              <p className="mt-3 line-clamp-4 leading-7 text-stone-300">
                {featuredService.description}
              </p>
              {featuredService.price && (
                <p className="mt-5 text-sm font-semibold text-amber-100">
                  Starting from Rs. {featuredService.price}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {services.map((service) => (
            <Link
              key={service.id}
              to={`/services/${service.id}`}
              className="group rounded-lg border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <CalendarDays className="mb-8 h-7 w-7 text-teal-800" />
              <h3 className="text-2xl font-semibold text-stone-950">{service.title}</h3>
              <p className="mt-3 line-clamp-3 leading-7 text-stone-600">{service.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-900">
                Plan this service
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#ede4d7] py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-teal-900">
                Memorial stories
              </p>
              <h2 className="max-w-2xl text-4xl font-semibold leading-tight text-stone-950 sm:text-5xl">
                Names, dates, and the stories that make a life whole.
              </h2>
            </div>
            <Link to="/obituaries" className="inline-flex items-center gap-2 font-semibold text-teal-950 hover:text-stone-700">
              View all memorials
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {obituaries.map((obit) => (
              <Link
                key={obit.id}
                to={`/obituaries/${obit.id}`}
                className="group overflow-hidden rounded-lg bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-[4/3] overflow-hidden bg-stone-200">
                  <img
                    src={obit.photo || '/memorial-hero.png'}
                    alt={obit.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-stone-950">{obit.name}</h3>
                  {(obit.birth_date || obit.death_date) && (
                    <p className="mt-2 text-sm font-medium text-stone-500">
                      {[formatDate(obit.birth_date), formatDate(obit.death_date)].filter(Boolean).join(' - ')}
                    </p>
                  )}
                  <p className="mt-4 line-clamp-3 leading-7 text-stone-600">{obit.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-900">
                    Read tribute
                    <BookOpenText className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
              Family voices
            </p>
            <h2 className="text-4xl font-semibold leading-tight text-stone-950">
              Quiet words from families we have served.
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <figure key={testimonial.id} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
                <blockquote className="leading-8 text-stone-700">
                  "{testimonial.message}"
                </blockquote>
                <figcaption className="mt-6 font-semibold text-stone-950">
                  {testimonial.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 rounded-lg bg-stone-950 p-8 text-white md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">
              24/7 support
            </p>
            <h2 className="text-3xl font-semibold">When you are ready, we can begin with one call.</h2>
          </div>
          <Link to="/contact">
            <Button className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-6 py-3 font-semibold text-stone-950 hover:bg-white">
              Contact Last Rites
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
