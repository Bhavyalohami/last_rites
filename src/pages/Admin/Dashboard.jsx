import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mail,
  MessageSquare,
  Package,
  Star,
  Users,
} from 'lucide-react';
import {
  getAdminObituaries,
  getAdminServices,
  getAdminTestimonials,
  getConversations,
  getMessages,
} from '../../api/adminAPI';
import ErrorMessage from '../../components/common/ErrorMessage';

const isEnabled = (item) => item?.is_active === true || item?.is_active === 1;
const isPublished = (item) => (item?.is_published === undefined || item?.is_published === true || item?.is_published === 1) && isEnabled(item);
const formatDate = (value) => {
  if (!value) return 'Not set';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not set';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
const formatTime = (value) => {
  if (!value) return 'No activity yet';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No activity yet';
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
};
const dateKey = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
};

const EmptyChart = ({ label }) => (
  <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed border-stone-200 bg-[#fbf8f3] text-sm font-semibold text-stone-400">
    {label}
  </div>
);

const StatCard = ({ title, value, detail, icon: Icon, tone }) => (
  <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
    <div className="mb-5 flex items-start justify-between gap-3">
      <div className={`inline-flex rounded-lg p-3 ${tone}`}>
        <Icon className="h-6 w-6" />
      </div>
      <span className="rounded-full bg-[#fbf8f3] px-3 py-1 text-xs font-semibold text-stone-500">Live</span>
    </div>
    <p className="text-3xl font-semibold text-stone-950">{value}</p>
    <p className="mt-1 text-sm font-semibold text-stone-700">{title}</p>
    <p className="mt-3 text-sm leading-6 text-stone-500">{detail}</p>
  </article>
);

const StatusPill = ({ status }) => {
  const styles = {
    open: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    pending: 'border-amber-200 bg-amber-50 text-amber-700',
    closed: 'border-stone-200 bg-stone-100 text-stone-600',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${styles[status] || styles.open}`}>
      {status === 'closed' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
      {status || 'open'}
    </span>
  );
};

const Dashboard = () => {
  const [data, setData] = useState({
    services: [],
    obituaries: [],
    testimonials: [],
    messages: [],
    conversations: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      getAdminServices(),
      getAdminObituaries(),
      getAdminTestimonials(),
      getMessages(),
      getConversations(),
    ])
      .then(([servicesRes, obitsRes, testRes, msgsRes, convRes]) => {
        setData({
          services: servicesRes.data || [],
          obituaries: obitsRes.data || [],
          testimonials: testRes.data || [],
          messages: msgsRes.data || [],
          conversations: convRes.data || [],
        });
        setError('');
      })
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  const dashboard = useMemo(() => {
    const { services, obituaries, testimonials, messages, conversations } = data;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayKey = today.toISOString().slice(0, 10);

    const activeServices = services.filter(isEnabled).length;
    const featuredServices = services.filter((item) => item.is_featured === true || item.is_featured === 1).length;
    const publishedMemorials = obituaries.filter(isPublished).length;
    const upcomingFunerals = obituaries
      .filter((item) => item.funeral_date && new Date(item.funeral_date) >= today)
      .sort((a, b) => new Date(a.funeral_date) - new Date(b.funeral_date));
    const activeTestimonials = testimonials.filter(isEnabled).length;
    const featuredTestimonials = testimonials.filter((item) => item.is_featured === true || item.is_featured === 1).length;
    const ratings = testimonials.map((item) => Number(item.rating)).filter((rating) => Number.isFinite(rating) && rating > 0);
    const averageRating = ratings.length ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1) : '0.0';

    const openConversations = conversations.filter((item) => item.status === 'open').length;
    const pendingConversations = conversations.filter((item) => item.status === 'pending').length;
    const closedConversations = conversations.filter((item) => item.status === 'closed').length;
    const unassignedConversations = conversations.filter((item) => item.status !== 'closed' && !item.admin_name).length;
    const todayMessages = messages.filter((item) => dateKey(item.created_at) === todayKey).length;

    const totalContent = services.length + obituaries.length + testimonials.length;
    const visibleContent = activeServices + publishedMemorials + activeTestimonials;
    const contentCoverage = totalContent ? Math.round((visibleContent / totalContent) * 100) : 0;

    const weeklyData = Array.from({ length: 7 }, (_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() - (6 - index));
      const key = day.toISOString().slice(0, 10);

      return {
        date: day.toLocaleDateString('en-US', { weekday: 'short' }),
        services: services.filter((item) => dateKey(item.created_at) === key).length,
        memorials: obituaries.filter((item) => dateKey(item.created_at) === key).length,
        messages: messages.filter((item) => dateKey(item.created_at) === key).length,
        conversations: conversations.filter((item) => dateKey(item.last_message_at || item.created_at) === key).length,
      };
    });

    const contentMix = [
      { name: 'Services', value: services.length, color: '#0f766e' },
      { name: 'Memorials', value: obituaries.length, color: '#b45309' },
      { name: 'Testimonials', value: testimonials.length, color: '#57534e' },
      { name: 'Messages', value: messages.length, color: '#047857' },
    ];

    const conversationMix = [
      { name: 'Open', value: openConversations, color: '#059669' },
      { name: 'Pending', value: pendingConversations, color: '#d97706' },
      { name: 'Closed', value: closedConversations, color: '#78716c' },
    ];

    return {
      activeServices,
      featuredServices,
      publishedMemorials,
      upcomingFunerals,
      activeTestimonials,
      featuredTestimonials,
      averageRating,
      openConversations,
      pendingConversations,
      closedConversations,
      unassignedConversations,
      todayMessages,
      contentCoverage,
      weeklyData,
      contentMix,
      conversationMix,
      recentMessages: messages.slice(0, 4),
      recentConversations: conversations.slice(0, 5),
    };
  }, [data]);

  const statCards = [
    {
      title: 'Services',
      value: data.services.length,
      detail: `${dashboard.activeServices} active, ${dashboard.featuredServices} featured`,
      icon: Package,
      tone: 'text-teal-900 bg-teal-50',
    },
    {
      title: 'Memorials',
      value: data.obituaries.length,
      detail: `${dashboard.publishedMemorials} published, ${dashboard.upcomingFunerals.length} upcoming services`,
      icon: Users,
      tone: 'text-amber-800 bg-amber-50',
    },
    {
      title: 'Conversations',
      value: data.conversations.length,
      detail: `${dashboard.openConversations} open, ${dashboard.pendingConversations} pending`,
      icon: MessageSquare,
      tone: 'text-indigo-700 bg-indigo-50',
    },
    {
      title: 'Contact messages',
      value: data.messages.length,
      detail: `${dashboard.todayMessages} received today`,
      icon: Mail,
      tone: 'text-emerald-700 bg-emerald-50',
    },
    {
      title: 'Testimonials',
      value: data.testimonials.length,
      detail: `${dashboard.activeTestimonials} active, ${dashboard.averageRating} average rating`,
      icon: Star,
      tone: 'text-stone-700 bg-stone-100',
    },
  ];

  const actionItems = [
    {
      label: 'Open conversations',
      value: dashboard.openConversations,
      detail: 'Need active admin attention',
      href: '/admin/conversations',
      icon: MessageSquare,
    },
    {
      label: 'Unassigned threads',
      value: dashboard.unassignedConversations,
      detail: 'No admin owner yet',
      href: '/admin/conversations',
      icon: AlertCircle,
    },
    {
      label: 'Public content health',
      value: `${dashboard.contentCoverage}%`,
      detail: 'Active or published content',
      href: '/admin/services',
      icon: CheckCircle2,
    },
  ];

  const hasWeeklyActivity = dashboard.weeklyData.some((item) => item.services || item.memorials || item.messages || item.conversations);
  const hasContentMix = dashboard.contentMix.some((item) => item.value > 0);
  const hasConversationMix = dashboard.conversationMix.some((item) => item.value > 0);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-lg bg-stone-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-36 animate-pulse rounded-lg bg-stone-200" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-lg bg-stone-200" />
          <div className="h-80 animate-pulse rounded-lg bg-stone-200" />
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl">
      <section className="mb-8 overflow-hidden rounded-lg bg-[#182522] text-white">
        <div className="grid gap-6 p-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-amber-200">Admin overview</p>
            <h1 className="text-4xl font-semibold">Care operations command center</h1>
            <p className="mt-3 max-w-2xl leading-7 text-stone-300">
              Track content readiness, family requests, support conversations, and upcoming memorial work from one focused admin dashboard.
            </p>
          </div>
          <div className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.06] p-4">
            {actionItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.label} to={item.href} className="group flex items-center justify-between gap-4 rounded-lg bg-white/[0.06] p-3 transition hover:bg-white/[0.12]">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-amber-100 text-stone-950">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-white">{item.label}</p>
                      <p className="truncate text-xs text-stone-400">{item.detail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-amber-100">{item.value}</span>
                    <ArrowRight className="h-4 w-4 text-stone-500 transition group-hover:translate-x-0.5 group-hover:text-amber-100" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {error && <ErrorMessage message={error} />}

      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </section>

      <section className="mb-8 grid gap-6 lg:grid-cols-[1.45fr_0.8fr]">
        <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <h2 className="text-2xl font-semibold text-stone-950">7-day activity</h2>
              <p className="mt-1 text-sm text-stone-500">Real activity from content creation, contact forms, and conversation updates.</p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#fbf8f3] px-3 py-1 text-xs font-semibold text-stone-500">
              <CalendarDays className="h-4 w-4" />
              Last 7 days
            </span>
          </div>
          {hasWeeklyActivity ? (
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={dashboard.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                <XAxis dataKey="date" stroke="#78716c" />
                <YAxis allowDecimals={false} stroke="#78716c" />
                <Tooltip />
                <Area type="monotone" dataKey="services" stackId="1" name="Services" stroke="#0f766e" fill="#0f766e" fillOpacity={0.24} />
                <Area type="monotone" dataKey="memorials" stackId="1" name="Memorials" stroke="#b45309" fill="#b45309" fillOpacity={0.22} />
                <Area type="monotone" dataKey="messages" stackId="1" name="Messages" stroke="#047857" fill="#047857" fillOpacity={0.18} />
                <Area type="monotone" dataKey="conversations" stackId="1" name="Conversations" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.16} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label="No tracked activity in the last 7 days" />
          )}
        </article>

        <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold text-stone-950">Conversation status</h2>
            <p className="mt-1 text-sm text-stone-500">Admin workload by thread status.</p>
          </div>
          {hasConversationMix ? (
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie data={dashboard.conversationMix} cx="50%" cy="50%" innerRadius={58} outerRadius={88} paddingAngle={4} dataKey="value">
                  {dashboard.conversationMix.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label="No conversations yet" />
          )}
          <div className="mt-4 grid gap-2">
            {dashboard.conversationMix.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between rounded-lg bg-[#fbf8f3] px-3 py-2 text-sm">
                <span className="flex items-center gap-2 text-stone-600">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}
                </span>
                <span className="font-semibold text-stone-950">{entry.value}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mb-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold text-stone-950">Content mix</h2>
            <p className="mt-1 text-sm text-stone-500">What currently fills the admin workspace.</p>
          </div>
          {hasContentMix ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={dashboard.contentMix} cx="50%" cy="50%" innerRadius={62} outerRadius={92} paddingAngle={3} dataKey="value">
                  {dashboard.contentMix.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart label="No content has been added yet" />
          )}
          <div className="mt-4 grid gap-2">
            {dashboard.contentMix.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-stone-600">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  {entry.name}
                </span>
                <span className="font-semibold text-stone-950">{entry.value}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-stone-950">Upcoming memorial services</h2>
              <p className="mt-1 text-sm text-stone-500">Funeral dates pulled from published memorial records.</p>
            </div>
            <Link to="/admin/obituaries" className="inline-flex items-center gap-2 rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white hover:bg-stone-800">
              Manage
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {dashboard.upcomingFunerals.length ? (
            <div className="grid gap-3">
              {dashboard.upcomingFunerals.slice(0, 4).map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 rounded-lg border border-stone-100 bg-[#fbf8f3] p-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-stone-950">{item.name}</p>
                    <p className="mt-1 truncate text-sm text-stone-500">{item.funeral_venue || 'Venue not set'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-stone-950">{formatDate(item.funeral_date)}</p>
                    <p className="text-xs text-stone-500">{isPublished(item) ? 'Published' : 'Draft'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-stone-200 bg-[#fbf8f3] p-8 text-center text-sm font-semibold text-stone-400">
              No upcoming funeral dates are scheduled.
            </div>
          )}
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-stone-950">Recent contact messages</h2>
              <p className="mt-1 text-sm text-stone-500">Newest public contact form submissions.</p>
            </div>
            <Link to="/admin/messages" className="text-sm font-semibold text-teal-900 hover:text-stone-950">View all</Link>
          </div>
          <div className="space-y-3">
            {dashboard.recentMessages.length ? (
              dashboard.recentMessages.map((message) => (
                <div key={message.id} className="rounded-lg border border-stone-100 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-stone-950">{message.subject || 'No subject'}</p>
                      <p className="mt-1 truncate text-sm text-stone-500">{message.name} | {message.email}</p>
                    </div>
                    <span className="flex-none text-xs text-stone-400">{formatTime(message.created_at)}</span>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-600">{message.message}</p>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-stone-200 bg-[#fbf8f3] p-8 text-center text-sm font-semibold text-stone-400">
                No contact messages yet.
              </div>
            )}
          </div>
        </article>

        <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-stone-950">Latest conversations</h2>
              <p className="mt-1 text-sm text-stone-500">Most recently updated family support threads.</p>
            </div>
            <Link to="/admin/conversations" className="text-sm font-semibold text-teal-900 hover:text-stone-950">View all</Link>
          </div>
          <div className="space-y-3">
            {dashboard.recentConversations.length ? (
              dashboard.recentConversations.map((conversation) => (
                <Link key={conversation.id} to={`/admin/chats/${conversation.id}`} className="block rounded-lg border border-stone-100 p-4 transition hover:border-stone-300 hover:bg-[#fbf8f3]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-stone-950">{conversation.subject || 'Family support request'}</p>
                      <p className="mt-1 truncate text-sm text-stone-500">{conversation.user_name} | {conversation.user_email}</p>
                    </div>
                    <StatusPill status={conversation.status} />
                  </div>
                  <p className="mt-3 text-xs text-stone-500">Last activity: {formatTime(conversation.last_message_at || conversation.created_at)}</p>
                </Link>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-stone-200 bg-[#fbf8f3] p-8 text-center text-sm font-semibold text-stone-400">
                No conversations yet.
              </div>
            )}
          </div>
        </article>
      </section>
    </main>
  );
};

export default Dashboard;
