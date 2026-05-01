import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import assetUrl from '../../utils/assetUrl';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/obituaries', label: 'Obituaries' },
  { to: '/contact', label: 'Contact' },
];

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  const navLinkClasses = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
      isActive
        ? 'bg-stone-950 text-white'
        : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950'
    }`;

  const mobileNavLinkClasses = ({ isActive }) =>
    `block rounded-lg px-4 py-3 text-base font-semibold transition-colors ${
      isActive
        ? 'bg-stone-950 text-white'
        : 'text-stone-700 hover:bg-stone-100 hover:text-stone-950'
    }`;

  const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-[#faf7f2]/95 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex min-h-20 items-center justify-between gap-4">
          <NavLink to="/" onClick={closeMenu} className="flex min-w-0 items-center">
            <img src={assetUrl('/logo.png')} className="h-12 w-auto sm:h-14" alt="Last Rites" />
          </NavLink>

          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={navLinkClasses}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            {isAuthenticated ? (
              <>
                <NavLink
                  to={dashboardPath}
                  className={({ isActive }) =>
                    `max-w-44 truncate rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-[#ede4d7] text-stone-950'
                        : 'text-stone-700 hover:bg-stone-100 hover:text-stone-950'
                    }`
                  }
                  title={user?.name}
                >
                  {user?.name || 'Dashboard'}
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full bg-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-300"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClasses}>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-full bg-stone-950 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-stone-800"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-800 shadow-sm transition hover:bg-stone-100 lg:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-stone-200 py-4 lg:hidden">
            <ul className="grid gap-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} onClick={closeMenu} className={mobileNavLinkClasses}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="mt-4 grid gap-2 border-t border-stone-200 pt-4">
              {isAuthenticated ? (
                <>
                  <NavLink to={dashboardPath} onClick={closeMenu} className={mobileNavLinkClasses}>
                    {user?.name || 'Dashboard'}
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-stone-950 px-4 py-3 font-semibold text-white transition-colors hover:bg-stone-800"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" onClick={closeMenu} className={mobileNavLinkClasses}>
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={closeMenu}
                    className="block rounded-lg bg-stone-950 px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-stone-800"
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
