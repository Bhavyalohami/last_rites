import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock, IndianRupee, Phone, Star } from 'lucide-react';
import { getServiceById, getServices } from '../../api/publicAPI';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import assetUrl from '../../utils/assetUrl';

const included = [
  'Professional coordination and step-by-step guidance',
  'Documentation support and practical scheduling',
  'Transport and venue coordination where required',
  'Priest, community, or ceremony support',
  'Follow-up care and memorial guidance',
];

const formatPrice = (price) => {
  const num = parseFloat(price);
  if (Number.isNaN(num)) return price;
  return num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
};

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getServiceById(id), getServices()])
      .then(([serviceRes, allServicesRes]) => {
        setService(serviceRes.data);
        setRelatedServices(allServicesRes.data.filter((item) => item.id !== parseInt(id, 10)).slice(0, 2));
      })
      .catch(() => setError('Service not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <main className="bg-[#f8f3ec] text-stone-900">
      <section className="relative overflow-hidden bg-stone-950 text-white">
        <img src={service.image || assetUrl('/memorial-hero.png')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-950/25" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
          <Link to="/services" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-stone-200 hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Back to services
          </Link>
          <div className="max-w-3xl">
            {service.is_featured === 1 && (
              <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-stone-950">
                <Star className="h-4 w-4" />
                Featured service
              </span>
            )}
            <h1 className="text-5xl font-semibold leading-tight sm:text-6xl">{service.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-100">{service.description}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_360px] lg:px-10">
        <div className="space-y-10">
          <div className="grid gap-4 sm:grid-cols-3">
            {service.duration && (
              <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
                <Clock className="mb-4 h-6 w-6 text-teal-900" />
                <p className="text-sm text-stone-500">Duration</p>
                <p className="mt-1 font-semibold text-stone-950">{service.duration}</p>
              </div>
            )}
            {service.price && (
              <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
                <IndianRupee className="mb-4 h-6 w-6 text-teal-900" />
                <p className="text-sm text-stone-500">Starting price</p>
                <p className="mt-1 font-semibold text-stone-950">Rs. {formatPrice(service.price)}</p>
              </div>
            )}
            <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <CalendarDays className="mb-4 h-6 w-6 text-teal-900" />
              <p className="text-sm text-stone-500">Availability</p>
              <p className="mt-1 font-semibold text-stone-950">24/7 support</p>
            </div>
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-7 shadow-sm">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">Included</p>
            <h2 className="text-3xl font-semibold text-stone-950">What the family can expect</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {included.map((item) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#ede4d7] text-teal-950">
                    <Check className="h-3 w-3" />
                  </span>
                  <p className="leading-7 text-stone-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {service.tags && (
            <div className="flex flex-wrap gap-2">
              {JSON.parse(service.tags).map((tag) => (
                <span key={tag} className="rounded-full bg-[#ede4d7] px-3 py-1 text-sm font-semibold text-teal-950">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-lg bg-[#182522] p-6 text-white shadow-sm">
            <h2 className="text-2xl font-semibold">Need this arranged today?</h2>
            <p className="mt-3 leading-7 text-stone-300">A coordinator can help you confirm timing, documents, rituals, and family requirements.</p>
            <Link to="/contact" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-100 px-5 py-3 font-semibold text-stone-950 hover:bg-white">
              Contact us
              <Phone className="h-4 w-4" />
            </Link>
          </div>

          {relatedServices.length > 0 && (
            <div>
              <h3 className="mb-4 text-xl font-semibold text-stone-950">Related services</h3>
              <div className="space-y-3">
                {relatedServices.map((related) => (
                  <Link key={related.id} to={`/services/${related.id}`} className="group block rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
                    <h4 className="font-semibold text-stone-950">{related.title}</h4>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">{related.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-teal-900">
                      View
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
};

export default ServiceDetail;
