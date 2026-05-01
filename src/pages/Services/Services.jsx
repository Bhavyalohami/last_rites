import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Flame, Heart, IndianRupee, Phone, ShieldCheck, Star } from 'lucide-react';
import { getServices } from '../../api/publicAPI';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const formatPrice = (price) => {
  const num = parseFloat(price);
  if (Number.isNaN(num)) return price;
  return num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getServices()
      .then((res) => setServices(res.data))
      .catch(() => setError('Failed to load services.'))
      .finally(() => setLoading(false));
  }, []);

  const featuredService = useMemo(
    () => services.find((service) => service.is_featured === 1) || services[0],
    [services]
  );

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main className="bg-[#f8f3ec] text-stone-900">
      <section className="relative overflow-hidden bg-stone-950 text-white">
        <img src="/memorial-hero.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/76 to-stone-950/20" />
        <div className="relative mx-auto grid min-h-[480px] max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">Services</p>
            <h1 className="text-5xl font-semibold leading-tight sm:text-6xl">Every rite, arranged with clarity.</h1>
          </div>
          <div className="max-w-xl">
            <p className="text-lg leading-8 text-stone-100">
              From transport and documentation to priests, venues, rituals, and memorial pages, we help families move through the day without having to manage every detail alone.
            </p>
            <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-amber-100 px-6 py-3 font-semibold text-stone-950 hover:bg-white">
              Speak to a coordinator
              <Phone className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {featuredService && (
        <section className="mx-auto max-w-7xl px-5 pt-10 sm:px-8 lg:px-10">
          <div className="grid gap-6 rounded-lg bg-[#182522] p-7 text-white lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-amber-100">
                <Star className="h-4 w-4" />
                Featured care
              </div>
              <h2 className="text-3xl font-semibold">{featuredService.title}</h2>
            </div>
            <div>
              <p className="leading-7 text-stone-300">{featuredService.description}</p>
              {featuredService.price && (
                <p className="mt-4 font-semibold text-amber-100">Starting from Rs. {formatPrice(featuredService.price)}</p>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        {services.length === 0 ? (
          <div className="py-16 text-center">
            <Heart className="mx-auto mb-4 h-14 w-14 text-stone-300" />
            <p className="text-lg text-stone-500">No services available at the moment.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.id}`}
                className="group rounded-lg border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-8 flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ede4d7] text-teal-950">
                    <Flame className="h-6 w-6" />
                  </div>
                  {service.is_featured === 1 && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Featured</span>
                  )}
                </div>
                <h2 className="text-2xl font-semibold text-stone-950">{service.title}</h2>
                <p className="mt-3 line-clamp-4 leading-7 text-stone-600">{service.description}</p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm text-stone-500">
                  {service.duration && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {service.duration}
                    </span>
                  )}
                  {service.price && (
                    <span className="inline-flex items-center gap-1 font-semibold text-teal-900">
                      <IndianRupee className="h-4 w-4" />
                      {formatPrice(service.price)}
                    </span>
                  )}
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-teal-900">
                  View service
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-[#ede4d7] py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-teal-900">Personalized planning</p>
            <h2 className="text-4xl font-semibold leading-tight text-stone-950">Not every farewell fits a package.</h2>
          </div>
          <div className="rounded-lg bg-white p-7 shadow-sm">
            <ShieldCheck className="mb-5 h-7 w-7 text-teal-900" />
            <p className="leading-8 text-stone-700">
              Tell us what the family needs, what the tradition requires, and what would feel respectful. We can shape the service around timing, faith, budget, travel, and memorial preferences.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;
