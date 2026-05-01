import React, { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  FileQuestion,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Package,
  ShieldCheck,
  Settings,
  Star,
  Users,
  X,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

const navSections = [
  {
    label: 'Operations',
    items: [
      { path: '/admin/dashboard', name: 'Dashboard', icon: LayoutDashboard },
      { path: '/admin/conversations', name: 'Conversations', icon: MessageSquare },
      { path: '/admin/messages', name: 'Messages', icon: Mail },
    ],
  },
  {
    label: 'Content',
    items: [
      { path: '/admin/services', name: 'Services', icon: Package },
      { path: '/admin/obituaries', name: 'Memorials', icon: Users },
      { path: '/admin/testimonials', name: 'Testimonials', icon: Star },
    ],
  },
  {
    label: 'Knowledge',
    items: [
      { path: '/admin/faq-categories', name: 'FAQ Categories', icon: HelpCircle },
      { path: '/admin/faq-questions', name: 'FAQ Questions', icon: FileQuestion },
      { path: '/admin/settings', name: 'Settings', icon: Settings },
    ],
  },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const currentPage = useMemo(() => {
    if (location.pathname.startsWith('/admin/chats')) return { name: 'Conversations', section: 'Operations' };

    return navSections
      .flatMap((section) => section.items.map((item) => ({ ...item, section: section.label })))
      .find((item) => item.path === location.pathname);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#f8f3ec] text-stone-900">
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-40 bg-stone-950/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[20rem] flex-col border-r border-white/10 bg-[#0d0c0a] text-stone-300 shadow-2xl transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-24 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-amber-100/20 bg-amber-100 text-lg font-semibold text-stone-950">
              LR
            </div>
            <div>
              <p className="text-xl font-semibold text-white">Last Rites</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">Admin console</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-full p-2 text-stone-400 hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-4 mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Admin access</p>
              <p className="text-xs text-stone-500">Secure operations panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          {navSections.map((section) => (
            <div key={section.label} className="mb-7">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `group relative flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                          isActive
                            ? 'bg-[#f8f3ec] text-stone-950 shadow-sm'
                            : 'text-stone-300 hover:bg-white/10 hover:text-white'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span className={`absolute left-0 h-6 w-1 rounded-r-full ${isActive ? 'bg-amber-300' : 'bg-transparent'}`} />
                          <Icon className={`h-5 w-5 ${isActive ? 'text-teal-950' : 'text-stone-400 group-hover:text-white'}`} />
                          <span>{item.name}</span>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="mb-4 rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 font-semibold text-stone-950">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">{user?.name || 'Admin'}</p>
                <p className="truncate text-xs text-stone-500">{user?.email}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 font-semibold text-amber-100 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="md:pl-[20rem]">
        <header className="sticky top-0 z-30 border-b border-stone-200 bg-[#f8f3ec]/90 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between px-5 sm:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-full p-2 text-stone-600 hover:bg-stone-100 hover:text-stone-950 md:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="min-w-0">
              <p className="hidden text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 md:block">
                {currentPage?.section || 'Admin'}
              </p>
              <p className="truncate text-lg font-semibold text-stone-950">
                {currentPage?.name || 'Admin console'}
              </p>
            </div>
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen((value) => !value)}
                className="flex items-center gap-3 rounded-full border border-stone-200 bg-white px-2 py-2 pr-4 shadow-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-950 font-semibold text-white">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <span className="hidden text-sm font-semibold text-stone-800 sm:inline">{user?.name || 'Admin'}</span>
                <ChevronDown className="h-4 w-4 text-stone-400" />
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg border border-stone-200 bg-white p-2 shadow-xl">
                  <div className="border-b border-stone-100 px-3 py-3">
                    <p className="font-semibold text-stone-950">{user?.name}</p>
                    <p className="text-sm text-stone-500">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)] px-5 py-6 sm:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
