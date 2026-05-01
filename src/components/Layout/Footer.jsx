import React from 'react';
import { NavLink } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import assetUrl from '../../utils/assetUrl';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const linkClasses = ({ isActive }) =>
    `transition hover:text-white ${isActive ? 'text-white font-semibold' : 'text-stone-400'}`;

  return (
    <footer className="bg-stone-950 text-stone-300">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <img src={assetUrl('/logo-dark.png')} className="mb-5 h-20 w-auto" alt="Last Rites" />
            <p className="max-w-sm text-sm leading-7 text-stone-400">
              Memorial care, last rites coordination, tribute pages, and family support with dignity and clarity.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li><NavLink to="/about" className={linkClasses}>About</NavLink></li>
              <li><NavLink to="/services" className={linkClasses}>Services</NavLink></li>
              <li><NavLink to="/obituaries" className={linkClasses}>Memorials</NavLink></li>
              <li><NavLink to="/resources" className={linkClasses}>Resources</NavLink></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><NavLink to="/contact" className={linkClasses}>Contact</NavLink></li>
              <li><NavLink to="/login" className={linkClasses}>Login</NavLink></li>
              <li><NavLink to="/register" className={linkClasses}>Register</NavLink></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">Reach us</h3>
            <ul className="space-y-4 text-sm text-stone-400">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-none text-amber-200" />
                <span>123 Peace Street, Green Park, New Delhi, 110016</span>
              </li>
              <li className="flex gap-3">
                <Phone className="h-4 w-4 flex-none text-amber-200" />
                <a href="tel:+911234567890" className="hover:text-white">+91 12345 67890</a>
              </li>
              <li className="flex gap-3">
                <Mail className="h-4 w-4 flex-none text-amber-200" />
                <a href="mailto:support@lastrites.com" className="hover:text-white">support@lastrites.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-stone-500">
          Copyright {currentYear} Last Rites. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
