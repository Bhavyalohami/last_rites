import React from 'react';
import { Award, Globe2, HeartHandshake, ShieldCheck, Sparkles, Users } from 'lucide-react';

const values = [
  {
    icon: HeartHandshake,
    title: 'Steady compassion',
    copy: 'Families meet a calm voice first, then a team that stays close through the hard decisions.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparent care',
    copy: 'Every service, document, price, and next step is explained plainly before anything begins.',
  },
  {
    icon: Globe2,
    title: 'Respect for tradition',
    copy: 'We support Hindu, Muslim, Christian, Sikh, and personal family customs without flattening them.',
  },
];

const team = [
  {
    name: 'Dr. Anjali Sharma',
    role: 'Founder and care director',
    bio: 'Leads family coordination with two decades of experience in dignified farewell services.',
  },
  {
    name: 'Rajesh Kumar',
    role: 'Grief support lead',
    bio: 'Helps families find language, ritual, and practical support in the days after loss.',
  },
  {
    name: 'Priya Menon',
    role: 'Ritual specialist',
    bio: 'Coordinates priests, venues, rites, timing, and cultural details with quiet precision.',
  },
];

const About = () => {
  return (
    <main className="bg-[#f8f3ec] text-stone-900">
      <section className="relative overflow-hidden bg-stone-950 text-white">
        <img src="/memorial-hero.png" alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/76 to-stone-950/25" />
        <div className="relative mx-auto grid min-h-[460px] max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">About Last Rites</p>
            <h1 className="text-5xl font-semibold leading-tight sm:text-6xl">Care for the ceremony, and the story around it.</h1>
          </div>
          <p className="max-w-xl text-lg leading-8 text-stone-100">
            Last Rites is built for the moment when families need both practical coordination and a meaningful way to remember. We arrange the farewell, preserve the tribute, and make the next step clear.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">Our mission</p>
          <h2 className="text-4xl font-semibold leading-tight text-stone-950">To make a difficult day feel held, not handled.</h2>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-7 shadow-sm">
          <p className="text-lg leading-8 text-stone-700">
            We believe a farewell should protect dignity, respect belief, and leave space for memory. Our work is part service desk, part ritual coordination, and part memorial storytelling: all designed to reduce confusion when the family has very little room to think.
          </p>
        </div>
      </section>

      <section className="bg-[#182522] py-16 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-10 max-w-2xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">What guides us</p>
            <h2 className="text-4xl font-semibold leading-tight sm:text-5xl">A quieter standard for end-of-life care.</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article key={value.title} className="rounded-lg border border-white/10 bg-white/[0.06] p-6">
                  <Icon className="mb-8 h-8 w-8 text-amber-200" />
                  <h3 className="mb-3 text-2xl font-semibold">{value.title}</h3>
                  <p className="leading-7 text-stone-300">{value.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-teal-900">The people</p>
            <h2 className="max-w-2xl text-4xl font-semibold leading-tight text-stone-950">A team trained for logistics, ritual, and tenderness.</h2>
          </div>
          <Users className="h-10 w-10 text-teal-900" />
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {team.map((member) => (
            <article key={member.name} className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#ede4d7] text-teal-950">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-semibold text-stone-950">{member.name}</h3>
              <p className="mt-1 text-sm font-semibold text-amber-700">{member.role}</p>
              <p className="mt-4 leading-7 text-stone-600">{member.bio}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl rounded-lg bg-[#ede4d7] p-8">
          <Sparkles className="mb-5 h-7 w-7 text-amber-700" />
          <p className="max-w-3xl text-2xl leading-10 text-stone-900">
            The goal is simple: a family should leave the ceremony with fewer unanswered questions and a clearer place to return when they want to remember.
          </p>
        </div>
      </section>
    </main>
  );
};

export default About;
