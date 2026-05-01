import React from 'react';
import { BookOpenText, CheckCircle2, FileText, HeartHandshake, Scale, ScrollText } from 'lucide-react';
import assetUrl from '../../utils/assetUrl';

const articles = [
  {
    icon: HeartHandshake,
    title: 'Coping with grief',
    excerpt: 'Gentle ways to move through the first days, speak with children, and ask for support.',
  },
  {
    icon: ScrollText,
    title: 'Understanding last rites',
    excerpt: 'A simple guide to common ceremony steps, timing, and family roles.',
  },
  {
    icon: Scale,
    title: 'Legal matters after death',
    excerpt: 'Documents, certificates, accounts, and practical notifications families often need.',
  },
];

const documents = [
  'Death certificate copies',
  'Identity documents',
  'Hospital or police paperwork, if applicable',
  'Insurance and bank information',
  'Will, property papers, or nominee details',
];

const nextSteps = [
  'Inform close family and choose one point of contact',
  'Confirm transport and ceremony location',
  'Collect required documents',
  'Decide rituals, timings, and priest/community support',
  'Create or update the memorial page',
];

const traditions = [
  ['Hindu rites', 'Cremation, prayers, pind daan, ashes, and family rituals.'],
  ['Muslim Janaza', 'Ghusl, kafan, Janaza prayer, and burial coordination.'],
  ['Christian rites', 'Wake, funeral service, burial or cremation, and remembrance gathering.'],
  ['Sikh Antam Sanskar', 'Kirtan, ardas, cremation, and paath arrangements.'],
];

const Resources = () => {
  return (
    <main className="bg-[#f8f3ec] text-stone-900">
      <section className="relative overflow-hidden bg-stone-950 text-white">
        <img src={assetUrl('/memorial-hero.png')} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/78 to-stone-950/20" />
        <div className="relative mx-auto grid min-h-[460px] max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">Resources</p>
            <h1 className="text-5xl font-semibold leading-tight sm:text-6xl">Plain answers for a difficult week.</h1>
          </div>
          <p className="max-w-xl text-lg leading-8 text-stone-100">
            Practical guides for grief, ceremonies, documents, and cultural rituals, written to be useful when everything feels urgent.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-teal-900">Support guides</p>
          <h2 className="max-w-2xl text-4xl font-semibold leading-tight text-stone-950">Start with what you need right now.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {articles.map((article) => {
            const Icon = article.icon;
            return (
              <article key={article.title} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
                <Icon className="mb-8 h-8 w-8 text-teal-900" />
                <h3 className="text-2xl font-semibold text-stone-950">{article.title}</h3>
                <p className="mt-3 leading-7 text-stone-600">{article.excerpt}</p>
                <button className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-900">
                  Read guide
                  <BookOpenText className="h-4 w-4" />
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-[#182522] py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-2 lg:px-10">
          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-7">
            <FileText className="mb-6 h-8 w-8 text-amber-200" />
            <h2 className="text-3xl font-semibold">Required documents</h2>
            <ul className="mt-6 space-y-4">
              {documents.map((item) => (
                <li key={item} className="flex gap-3 text-stone-300">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-amber-200" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-7">
            <CheckCircle2 className="mb-6 h-8 w-8 text-amber-200" />
            <h2 className="text-3xl font-semibold">Next-of-kin checklist</h2>
            <ul className="mt-6 space-y-4">
              {nextSteps.map((item) => (
                <li key={item} className="flex gap-3 text-stone-300">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-amber-200" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">Rites and traditions</p>
          <h2 className="max-w-2xl text-4xl font-semibold leading-tight text-stone-950">Respectful summaries, never one-size-fits-all.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {traditions.map(([title, copy]) => (
            <article key={title} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-semibold text-stone-950">{title}</h3>
              <p className="mt-4 leading-7 text-stone-600">{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Resources;
