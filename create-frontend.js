const fs = require('fs');
const path = require('path');

// ============================================
// 1. Define all folders to create
// ============================================
const folders = [
  'src/api',
  'src/assets/images',
  'src/components/Layout',
  'src/components/UI',
  'src/components/common',
  'src/context',
  'src/hooks',
  'src/pages/Home',
  'src/pages/About',
  'src/pages/Services',
  'src/pages/Obituaries',
  'src/pages/Contact',
  'src/pages/Resources',
  'src/pages/Admin',
  'src/routes',
  'src/styles',
  'src/utils'
];

// ============================================
// 2. Define file paths and their contents
// ============================================
const files = [
  // ---------- API Layer ----------
  {
    path: 'src/api/axiosConfig.js',
    content: `import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

// Add a request interceptor to include auth token for admin calls
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token && config.url.startsWith('/admin')) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;`
  },
  {
    path: 'src/api/publicAPI.js',
    content: `import API from './axiosConfig';

// Public endpoints
export const getServices = () => API.get('/services');
export const getServiceById = (id) => API.get(\`/services/\${id}\`);
export const getObituaries = () => API.get('/obituaries');
export const getObituaryById = (id) => API.get(\`/obituaries/\${id}\`);
export const getTestimonials = () => API.get('/testimonials');
export const submitContact = (data) => API.post('/contact', data);
export const getSettings = () => API.get('/settings');`
  },
  {
    path: 'src/api/adminAPI.js',
    content: `import API from './axiosConfig';

// Admin login
export const adminLogin = (credentials) => API.post('/admin/login', credentials);

// Services management
export const getAdminServices = () => API.get('/admin/services');
export const createService = (data) => API.post('/admin/services', data);
export const updateService = (id, data) => API.put(\`/admin/services/\${id}\`, data);
export const deleteService = (id) => API.delete(\`/admin/services/\${id}\`);

// Obituaries management
export const getAdminObituaries = () => API.get('/admin/obituaries');
export const createObituary = (data) => API.post('/admin/obituaries', data);
export const updateObituary = (id, data) => API.put(\`/admin/obituaries/\${id}\`, data);
export const deleteObituary = (id) => API.delete(\`/admin/obituaries/\${id}\`);

// Testimonials management
export const getAdminTestimonials = () => API.get('/admin/testimonials');
export const createTestimonial = (data) => API.post('/admin/testimonials', data);
export const deleteTestimonial = (id) => API.delete(\`/admin/testimonials/\${id}\`);

// Contact messages
export const getMessages = () => API.get('/admin/messages');
export const deleteMessage = (id) => API.delete(\`/admin/messages/\${id}\`);

// Settings
export const getAdminSettings = () => API.get('/admin/settings');
export const updateSettings = (data) => API.put('/admin/settings', data);`
  },

  // ---------- Components ----------
  {
    path: 'src/components/Layout/Header.jsx',
    content: `import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-serif text-primary">Last Rites</Link>
        <ul className="flex space-x-6">
          <li><Link to="/" className="hover:text-primary">Home</Link></li>
          <li><Link to="/about" className="hover:text-primary">About</Link></li>
          <li><Link to="/services" className="hover:text-primary">Services</Link></li>
          <li><Link to="/obituaries" className="hover:text-primary">Obituaries</Link></li>
          <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;`
  },
  {
    path: 'src/components/Layout/Footer.jsx',
    content: `import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-8 mt-12">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} Last Rites. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;`
  },
  {
    path: 'src/components/Layout/Layout.jsx',
    content: `import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;`
  },
  {
    path: 'src/components/UI/Button.jsx',
    content: `import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '' }) => {
  const baseClasses = 'px-4 py-2 rounded transition-colors';
  const variants = {
    primary: 'bg-primary text-white hover:bg-opacity-90',
    secondary: 'bg-secondary text-dark hover:bg-opacity-90',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white'
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={\`\${baseClasses} \${variants[variant]} \${className}\`}
    >
      {children}
    </button>
  );
};

export default Button;`
  },
  {
    path: 'src/components/UI/Card.jsx',
    content: `import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={\`bg-white rounded-lg shadow-md overflow-hidden \${className}\`}>
      {children}
    </div>
  );
};

export default Card;`
  },
  {
    path: 'src/components/UI/Hero.jsx',
    content: `import React from 'react';

const Hero = ({ title, subtitle, image }) => {
  return (
    <section className="relative bg-cover bg-center h-96" style={{ backgroundImage: image ? \`url(\${image})\` : 'none' }}>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center">
        <h1 className="text-4xl md:text-5xl font-serif mb-4">{title}</h1>
        {subtitle && <p className="text-xl md:text-2xl">{subtitle}</p>}
      </div>
    </section>
  );
};

export default Hero;`
  },
  {
    path: 'src/components/common/Loader.jsx',
    content: `import React from 'react';

const Loader = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
};

export default Loader;`
  },
  {
    path: 'src/components/common/ErrorMessage.jsx',
    content: `import React from 'react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
      {message}
    </div>
  );
};

export default ErrorMessage;`
  },

  // ---------- Context ----------
  {
    path: 'src/context/ThemeContext.jsx',
    content: `import React, { createContext, useState, useEffect, useContext } from 'react';
import { getSettings } from '../api/publicAPI';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    primary_color: '#5C6F82',
    secondary_color: '#F5F1EB',
    font_heading: 'Playfair Display',
    font_body: 'Open Sans'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await getSettings();
        setSettings(res.data);
      } catch (error) {
        console.error('Failed to load theme settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Apply CSS variables to the document root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', settings.primary_color);
    root.style.setProperty('--secondary', settings.secondary_color);
    root.style.setProperty('--font-heading', settings.font_heading);
    root.style.setProperty('--font-body', settings.font_body);
  }, [settings]);

  return (
    <ThemeContext.Provider value={{ settings, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};`
  },

  // ---------- Hooks ----------
  {
    path: 'src/hooks/useAuth.js',
    content: `import { useState, useEffect } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = (token, user) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(user));
    setIsAuthenticated(true);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setUser(null);
  };

  return { isAuthenticated, user, loading, login, logout };
};

export default useAuth;`
  },
  {
    path: 'src/hooks/useTheme.js',
    content: `import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export const useTheme = () => useContext(ThemeContext);`
  },

  // ---------- Pages ----------
  {
    path: 'src/pages/Home/Home.jsx',
    content: `import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getServices, getTestimonials } from '../../api/publicAPI';
import Hero from '../../components/UI/Hero';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const Home = () => {
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getServices(), getTestimonials()])
      .then(([servicesRes, testimonialsRes]) => {
        setServices(servicesRes.data.slice(0, 3)); // show first 3
        setTestimonials(testimonialsRes.data.slice(0, 2)); // show first 2
      })
      .catch(err => setError('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <Hero title="Compassionate Farewell Services" subtitle="Honoring life with dignity and respect" />
      
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-serif text-center mb-8">Our Services</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map(service => (
            <Card key={service.id} className="p-6">
              <h3 className="text-xl font-serif mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              {service.price && <p className="text-lg font-semibold">₹{service.price}</p>}
            </Card>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/services">
            <Button>View All Services</Button>
          </Link>
        </div>
      </section>

      <section className="bg-secondary py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif text-center mb-8">What Families Say</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map(t => (
              <Card key={t.id} className="p-6">
                <p className="italic mb-4">"{t.message}"</p>
                <p className="font-semibold">— {t.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;`
  },
  {
    path: 'src/pages/About/About.jsx',
    content: `import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif mb-6">About Us</h1>
      <div className="prose max-w-none">
        <p className="mb-4">
          Last Rites is dedicated to providing dignified and respectful farewell services
          for families in their time of need. With years of experience and a compassionate
          team, we ensure every ritual is performed with care.
        </p>
        <p className="mb-4">
          Our mission is to support you through the difficult journey of loss, offering
          personalized services that honor your loved one's memory and cultural traditions.
        </p>
        <h2 className="text-2xl font-serif mt-8 mb-4">Our Team</h2>
        <p>
          We have a team of experienced professionals who understand the importance of
          cultural and religious sensitivity. We work closely with families to arrange
          every detail with precision and respect.
        </p>
      </div>
    </div>
  );
};

export default About;`
  },
  {
    path: 'src/pages/Services/Services.jsx',
    content: `import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getServices } from '../../api/publicAPI';
import Card from '../../components/UI/Card';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getServices()
      .then(res => setServices(res.data))
      .catch(err => setError('Failed to load services'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif mb-8">Our Services</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <Card key={service.id} className="p-6 hover:shadow-lg transition">
            <h2 className="text-2xl font-serif mb-2">{service.title}</h2>
            <p className="text-gray-600 mb-4">{service.description}</p>
            {service.price && <p className="text-lg font-semibold">₹{service.price}</p>}
            <Link to={\`/services/\${service.id}\`} className="text-primary hover:underline mt-4 block">
              View Details →
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Services;`
  },
  {
    path: 'src/pages/Services/ServiceDetail.jsx',
    content: `import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getServiceById } from '../../api/publicAPI';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getServiceById(id)
      .then(res => setService(res.data))
      .catch(err => setError('Service not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif mb-4">{service.title}</h1>
      {service.price && <p className="text-2xl text-primary mb-6">₹{service.price}</p>}
      <p className="text-gray-700 text-lg leading-relaxed">{service.description}</p>
      {/* Additional details can be added here */}
    </div>
  );
};

export default ServiceDetail;`
  },
  {
    path: 'src/pages/Obituaries/Obituaries.jsx',
    content: `import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getObituaries } from '../../api/publicAPI';
import Card from '../../components/UI/Card';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const Obituaries = () => {
  const [obituaries, setObituaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getObituaries()
      .then(res => setObituaries(res.data))
      .catch(err => setError('Failed to load obituaries'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif mb-8">Obituaries & Memorials</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {obituaries.map(obit => (
          <Card key={obit.id} className="p-6">
            {obit.photo && (
              <img src={obit.photo} alt={obit.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
            )}
            <h2 className="text-2xl font-serif text-center">{obit.name}</h2>
            {(obit.birth_date || obit.death_date) && (
              <p className="text-center text-gray-600">
                {obit.birth_date && new Date(obit.birth_date).toLocaleDateString()}
                {obit.birth_date && obit.death_date && ' — '}
                {obit.death_date && new Date(obit.death_date).toLocaleDateString()}
              </p>
            )}
            <p className="mt-4 text-gray-700 line-clamp-3">{obit.description}</p>
            <Link to={\`/obituaries/\${obit.id}\`} className="text-primary hover:underline mt-4 block text-center">
              Read Tribute
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Obituaries;`
  },
  {
    path: 'src/pages/Obituaries/ObituaryDetail.jsx',
    content: `import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getObituaryById } from '../../api/publicAPI';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const ObituaryDetail = () => {
  const { id } = useParams();
  const [obit, setObit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getObituaryById(id)
      .then(res => setObit(res.data))
      .catch(err => setError('Obituary not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      {obit.photo && (
        <img src={obit.photo} alt={obit.name} className="w-48 h-48 rounded-full mx-auto mb-6 object-cover" />
      )}
      <h1 className="text-4xl font-serif text-center mb-2">{obit.name}</h1>
      {(obit.birth_date || obit.death_date) && (
        <p className="text-center text-gray-600 mb-6">
          {obit.birth_date && new Date(obit.birth_date).toLocaleDateString()}
          {obit.birth_date && obit.death_date && ' — '}
          {obit.death_date && new Date(obit.death_date).toLocaleDateString()}
        </p>
      )}
      <div className="prose max-w-none">
        <p className="whitespace-pre-line">{obit.description}</p>
      </div>
    </div>
  );
};

export default ObituaryDetail;`
  },
  {
    path: 'src/pages/Contact/Contact.jsx',
    content: `import React, { useState } from 'react';
import { submitContact } from '../../api/publicAPI';
import Button from '../../components/UI/Button';
import ErrorMessage from '../../components/common/ErrorMessage';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await submitContact(formData);
      setSuccess('Your message has been sent. We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl font-serif mb-6">Contact Us</h1>
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
      {error && <ErrorMessage message={error} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          ></textarea>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </div>
  );
};

export default Contact;`
  },
  {
    path: 'src/pages/Resources/Resources.jsx',
    content: `import React from 'react';

const Resources = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif mb-6">Resources</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-serif mb-4">Grief Support</h2>
          <p className="mb-4">We offer resources to help you cope with loss. Contact us for counseling recommendations.</p>
        </section>
        <section>
          <h2 className="text-2xl font-serif mb-4">Legal Documents</h2>
          <p className="mb-4">Information about death certificates, will execution, and other legal matters.</p>
        </section>
        <section className="md:col-span-2">
          <h2 className="text-2xl font-serif mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">What should I do immediately after a death?</h3>
              <p>Contact us at [phone] for immediate assistance. We'll guide you through the next steps.</p>
            </div>
            <div>
              <h3 className="font-semibold">How much do services cost?</h3>
              <p>Our services vary. Please see our Services page for pricing or contact us for a personalized quote.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Resources;`
  },
  // ---------- Admin Pages ----------
  {
    path: 'src/pages/Admin/Login.jsx',
    content: `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../api/adminAPI';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/UI/Button';
import ErrorMessage from '../../components/common/ErrorMessage';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await adminLogin({ email, password });
      login(res.data.token, res.data.user);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-serif mb-6 text-center">Admin Login</h1>
        {error && <ErrorMessage message={error} />}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;`
  },
  {
    path: 'src/pages/Admin/AdminLayout.jsx',
    content: `import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/UI/Button';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-serif">Admin Panel</h2>
          <p className="text-sm text-gray-600 mt-1">{user?.name}</p>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li><Link to="/admin/dashboard" className="block p-2 hover:bg-gray-200 rounded">Dashboard</Link></li>
            <li><Link to="/admin/services" className="block p-2 hover:bg-gray-200 rounded">Services</Link></li>
            <li><Link to="/admin/obituaries" className="block p-2 hover:bg-gray-200 rounded">Obituaries</Link></li>
            <li><Link to="/admin/testimonials" className="block p-2 hover:bg-gray-200 rounded">Testimonials</Link></li>
            <li><Link to="/admin/messages" className="block p-2 hover:bg-gray-200 rounded">Messages</Link></li>
            <li><Link to="/admin/settings" className="block p-2 hover:bg-gray-200 rounded">Settings</Link></li>
          </ul>
        </nav>
        <div className="p-4 border-t">
          <Button onClick={handleLogout} variant="outline" className="w-full">Logout</Button>
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;`
  },
  {
    path: 'src/pages/Admin/Dashboard.jsx',
    content: `import React, { useEffect, useState } from 'react';
import { getAdminServices, getAdminObituaries, getAdminTestimonials, getMessages } from '../../api/adminAPI';
import Loader from '../../components/common/Loader';

const Dashboard = () => {
  const [stats, setStats] = useState({ services: 0, obituaries: 0, testimonials: 0, messages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAdminServices(),
      getAdminObituaries(),
      getAdminTestimonials(),
      getMessages()
    ])
      .then(([servicesRes, obitsRes, testRes, msgsRes]) => {
        setStats({
          services: servicesRes.data.length,
          obituaries: obitsRes.data.length,
          testimonials: testRes.data.length,
          messages: msgsRes.data.length
        });
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-3xl font-serif mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Services" count={stats.services} />
        <StatCard title="Obituaries" count={stats.obituaries} />
        <StatCard title="Testimonials" count={stats.testimonials} />
        <StatCard title="Messages" count={stats.messages} />
      </div>
    </div>
  );
};

const StatCard = ({ title, count }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-gray-600 mb-2">{title}</h3>
    <p className="text-3xl font-bold">{count}</p>
  </div>
);

export default Dashboard;`
  },
  {
    path: 'src/pages/Admin/ServicesAdmin.jsx',
    content: `import React, { useState, useEffect } from 'react';
import { getAdminServices, createService, updateService, deleteService } from '../../api/adminAPI';
import Button from '../../components/UI/Button';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const ServicesAdmin = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', price: '', image: '' });

  const fetchServices = () => {
    setLoading(true);
    getAdminServices()
      .then(res => setServices(res.data))
      .catch(err => setError('Failed to load services'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateService(editingId, form);
      } else {
        await createService(form);
      }
      setForm({ title: '', description: '', price: '', image: '' });
      setEditingId(null);
      fetchServices();
    } catch (err) {
      setError('Operation failed');
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setForm({ title: service.title, description: service.description, price: service.price, image: service.image || '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteService(id);
        fetchServices();
      } catch (err) {
        setError('Delete failed');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-3xl font-serif mb-6">Manage Services</h1>
      {error && <ErrorMessage message={error} />}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-8 space-y-4">
        <h2 className="text-xl font-semibold">{editingId ? 'Edit Service' : 'Add New Service'}</h2>
        <div>
          <label className="block mb-1">Title</label>
          <input name="title" value={form.title} onChange={handleInputChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleInputChange} rows="3" className="w-full border rounded px-3 py-2"></textarea>
        </div>
        <div>
          <label className="block mb-1">Price (optional)</label>
          <input name="price" value={form.price} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">Image URL (optional)</label>
          <input name="image" value={form.image} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex space-x-2">
          <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
          {editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm({ title: '', description: '', price: '', image: '' }); }}>Cancel</Button>}
        </div>
      </form>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id} className="border-t">
                <td className="px-4 py-2">{service.title}</td>
                <td className="px-4 py-2">{service.price ? \`₹\${service.price}\` : '-'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => handleEdit(service)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServicesAdmin;`
  },
  // (Other admin pages like ObituariesAdmin, TestimonialsAdmin, MessagesAdmin, SettingsAdmin would be similar; for brevity, I'll include only one more as an example)
  {
    path: 'src/pages/Admin/SettingsAdmin.jsx',
    content: `import React, { useState, useEffect } from 'react';
import { getAdminSettings, updateSettings } from '../../api/adminAPI';
import Button from '../../components/UI/Button';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const SettingsAdmin = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getAdminSettings()
      .then(res => setSettings(res.data))
      .catch(err => setError('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await updateSettings(settings);
      setSuccess('Settings updated successfully');
    } catch (err) {
      setError('Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-3xl font-serif mb-6">Theme Settings</h1>
      {error && <ErrorMessage message={error} />}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-md space-y-4">
        <div>
          <label className="block mb-1">Primary Color</label>
          <input type="color" value={settings.primary_color || '#5C6F82'} onChange={(e) => handleChange('primary_color', e.target.value)} className="w-full h-10" />
        </div>
        <div>
          <label className="block mb-1">Secondary Color</label>
          <input type="color" value={settings.secondary_color || '#F5F1EB'} onChange={(e) => handleChange('secondary_color', e.target.value)} className="w-full h-10" />
        </div>
        <div>
          <label className="block mb-1">Heading Font</label>
          <select value={settings.font_heading || 'Playfair Display'} onChange={(e) => handleChange('font_heading', e.target.value)} className="w-full border rounded px-3 py-2">
            <option>Playfair Display</option>
            <option>Merriweather</option>
            <option>Georgia</option>
          </select>
        </div>
        <div>
          <label className="block mb-1">Body Font</label>
          <select value={settings.font_body || 'Open Sans'} onChange={(e) => handleChange('font_body', e.target.value)} className="w-full border rounded px-3 py-2">
            <option>Open Sans</option>
            <option>Raleway</option>
            <option>Roboto</option>
          </select>
        </div>
        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
      </form>
    </div>
  );
};

export default SettingsAdmin;`
  },

  // ---------- Routes ----------
  {
    path: 'src/routes/PrivateRoute.jsx',
    content: `import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loader from '../components/common/Loader';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader />;
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

export default PrivateRoute;`
  },
  {
    path: 'src/routes/AppRoutes.jsx',
    content: `import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Home from '../pages/Home/Home';
import About from '../pages/About/About';
import Services from '../pages/Services/Services';
import ServiceDetail from '../pages/Services/ServiceDetail';
import Obituaries from '../pages/Obituaries/Obituaries';
import ObituaryDetail from '../pages/Obituaries/ObituaryDetail';
import Contact from '../pages/Contact/Contact';
import Resources from '../pages/Resources/Resources';
import AdminLogin from '../pages/Admin/Login';
import AdminLayout from '../pages/Admin/AdminLayout';
import Dashboard from '../pages/Admin/Dashboard';
import ServicesAdmin from '../pages/Admin/ServicesAdmin';
import SettingsAdmin from '../pages/Admin/SettingsAdmin';
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes with Layout */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/services" element={<Layout><Services /></Layout>} />
      <Route path="/services/:id" element={<Layout><ServiceDetail /></Layout>} />
      <Route path="/obituaries" element={<Layout><Obituaries /></Layout>} />
      <Route path="/obituaries/:id" element={<Layout><ObituaryDetail /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/resources" element={<Layout><Resources /></Layout>} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="services" element={<ServicesAdmin />} />
        {/* Add other admin routes here */}
        <Route path="settings" element={<SettingsAdmin />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;`
  },

  // ---------- Styles ----------
  {
    path: 'src/styles/index.css',
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #5C6F82;
  --secondary: #F5F1EB;
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Open Sans', sans-serif;
}

body {
  font-family: var(--font-body);
  color: #2B2B2B;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}

.bg-primary { background-color: var(--primary); }
.text-primary { color: var(--primary); }
.bg-secondary { background-color: var(--secondary); }`
  },

  // ---------- App.js and index.js ----------
  {
    path: 'src/App.js',
    content: `import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AppRoutes from './routes/AppRoutes';
import './styles/index.css';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;`
  },
  {
    path: 'src/index.js',
    content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
  },

  // ---------- Environment file ----------
  {
    path: '.env',
    content: `REACT_APP_API_URL=http://localhost:5000/api`
  },

  // ---------- Tailwind config (optional) ----------
  {
    path: 'tailwind.config.js',
    content: `module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
      },
      fontFamily: {
        serif: ['var(--font-heading)', 'serif'],
        sans: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}`
  }
];

// ============================================
// 3. Create folders and files
// ============================================
folders.forEach(folder => {
  const fullPath = path.join(process.cwd(), folder);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created folder: ${folder}`);
  }
});

files.forEach(file => {
  const fullPath = path.join(process.cwd(), file.path);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, file.content);
  console.log(`Created file: ${file.path}`);
});

console.log('\n✅ React frontend structure created successfully!');
console.log('\n📦 Next steps:');
console.log('1. Install dependencies: npm install axios react-router-dom');
console.log('2. If using Tailwind, follow Tailwind installation guide (https://tailwindcss.com/docs/guides/create-react-app)');
console.log('3. Update .env if your backend runs on a different URL');
console.log('4. Run: npm start\n');