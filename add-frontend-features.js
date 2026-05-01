const fs = require('fs');
const path = require('path');

// ============================================
// Define all new files and their content
// ============================================
const files = [
  // Updated API files
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
export const getSettings = () => API.get('/settings');

// FAQ (public)
export const getFaqCategories = () => API.get('/faq/categories');
export const getQuestionsByCategory = (categoryId) => API.get(\`/faq/categories/\${categoryId}/questions\`);
export const getFaqQuestion = (id) => API.get(\`/faq/questions/\${id}\`);`
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
export const updateSettings = (data) => API.put('/admin/settings', data);

// ===== NEW: User Auth & Chat =====
// User registration/login
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const getCurrentUser = () => API.get('/auth/me');

// Conversations
export const getConversations = () => API.get('/chat/conversations');
export const startConversation = (subject) => API.post('/chat/conversations', { subject });
export const getConversationMessages = (conversationId) => API.get(\`/chat/conversations/\${conversationId}/messages\`);
export const sendMessage = (conversationId, message) => API.post(\`/chat/conversations/\${conversationId}/messages\`, { message });
export const updateConversationStatus = (conversationId, status) => API.put(\`/chat/conversations/\${conversationId}/status\`, { status });

// ===== NEW: Admin FAQ Management =====
export const getAdminFaqCategories = () => API.get('/admin/faq/categories');
export const createFaqCategory = (data) => API.post('/admin/faq/categories', data);
export const updateFaqCategory = (id, data) => API.put(\`/admin/faq/categories/\${id}\`, data);
export const deleteFaqCategory = (id) => API.delete(\`/admin/faq/categories/\${id}\`);

export const getAdminFaqQuestions = () => API.get('/admin/faq/questions');
export const createFaqQuestion = (data) => API.post('/admin/faq/questions', data);
export const updateFaqQuestion = (id, data) => API.put(\`/admin/faq/questions/\${id}\`, data);
export const deleteFaqQuestion = (id) => API.delete(\`/admin/faq/questions/\${id}\`);`
  },

  // Updated useAuth hook to handle both admin and user
  {
    path: 'src/hooks/useAuth.js',
    content: `import { useState, useEffect } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (storedToken && userData) {
      setToken(storedToken);
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return { isAuthenticated, user, token, loading, login, logout };
};

export default useAuth;`
  },

  // New Auth pages
  {
    path: 'src/pages/Auth/Login.jsx',
    content: `import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/adminAPI'; // reuse admin login? Actually we need separate user login. We'll use adminAPI but it's the same endpoint.
import useAuth from '../../hooks/useAuth';
import Button from '../../components/UI/Button';
import ErrorMessage from '../../components/common/ErrorMessage';

const Login = () => {
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
      const res = await loginUser({ email, password }); // This endpoint returns token and user
      login(res.data.token, res.data.user);
      // Redirect based on role
      if (res.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-serif mb-6 text-center">Login</h1>
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
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;`
  },
  {
    path: 'src/pages/Auth/Register.jsx',
    content: `import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/adminAPI';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/UI/Button';
import ErrorMessage from '../../components/common/ErrorMessage';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await registerUser(formData);
      login(res.data.token, res.data.user);
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-serif mb-6 text-center">Register</h1>
        {error && <ErrorMessage message={error} />}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Full Name</label>
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
            <label className="block text-gray-700 mb-2">Password (min. 6 characters)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Phone (optional)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;`
  },

  // New User Dashboard (list conversations)
  {
    path: 'src/pages/User/UserDashboard.jsx',
    content: `import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getConversations, startConversation } from '../../api/adminAPI';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import Button from '../../components/UI/Button';

const UserDashboard = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [subject, setSubject] = useState('');
  const { user } = useAuth();

  const fetchConversations = () => {
    setLoading(true);
    getConversations()
      .then(res => setConversations(res.data))
      .catch(err => setError('Failed to load conversations'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleStartChat = async (e) => {
    e.preventDefault();
    if (!subject.trim()) return;
    try {
      await startConversation(subject);
      setSubject('');
      setShowNewChat(false);
      fetchConversations();
    } catch (err) {
      setError('Could not start conversation');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif mb-6">My Dashboard</h1>
      <p className="mb-4">Welcome, {user?.name}!</p>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Conversations</h2>
        <Button onClick={() => setShowNewChat(!showNewChat)}>
          {showNewChat ? 'Cancel' : 'New Conversation'}
        </Button>
      </div>

      {showNewChat && (
        <form onSubmit={handleStartChat} className="bg-secondary p-4 rounded mb-6 flex gap-2">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject (optional)"
            className="flex-1 px-3 py-2 border rounded"
          />
          <Button type="submit">Start</Button>
        </form>
      )}

      {error && <ErrorMessage message={error} />}

      {conversations.length === 0 ? (
        <p className="text-gray-500">You have no conversations yet.</p>
      ) : (
        <div className="space-y-4">
          {conversations.map(conv => (
            <Link
              key={conv.id}
              to={\`/user/chat/\${conv.id}\`}
              className="block bg-white p-4 rounded shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{conv.subject || 'No subject'}</h3>
                  <p className="text-sm text-gray-600">
                    Status: <span className="capitalize">{conv.status}</span>
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(conv.last_message_at).toLocaleString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;`
  },
  {
    path: 'src/pages/User/Chat.jsx',
    content: `import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConversationMessages, sendMessage } from '../../api/adminAPI';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import Button from '../../components/UI/Button';

const Chat = () => {
  const { id } = useParams();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const fetchMessages = () => {
    setLoading(true);
    getConversationMessages(id)
      .then(res => {
        setConversation(res.data.conversation);
        setMessages(res.data.messages);
      })
      .catch(err => {
        setError('Failed to load messages');
        if (err.response?.status === 403) navigate('/user/dashboard');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
    // Polling every 5 seconds (optional)
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      await sendMessage(id, newMessage);
      setNewMessage('');
      fetchMessages(); // refresh
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-secondary px-6 py-4 border-b">
          <h2 className="text-xl font-serif">
            {conversation?.subject || 'Conversation'}
          </h2>
          <p className="text-sm text-gray-600">
            Status: <span className="capitalize">{conversation?.status}</span>
          </p>
        </div>

        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={\`flex \${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}\`}
            >
              <div
                className={\`max-w-xs md:max-w-md rounded-lg px-4 py-2 \${
                  msg.sender_id === user.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-800'
                }\`}
              >
                <p className="text-sm font-semibold mb-1">{msg.sender_name}</p>
                <p>{msg.message}</p>
                <p className="text-xs text-right mt-1 opacity-75">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="border-t p-4 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={conversation?.status === 'closed'}
          />
          <Button type="submit" disabled={sending || conversation?.status === 'closed'}>
            {sending ? 'Sending...' : 'Send'}
          </Button>
        </form>
        {conversation?.status === 'closed' && (
          <p className="text-center text-red-600 pb-2">This conversation is closed.</p>
        )}
      </div>
    </div>
  );
};

export default Chat;`
  },

  // New Chatbot Components
  {
    path: 'src/components/Chatbot/ChatbotWidget.jsx',
    content: `import React, { useState, useEffect } from 'react';
import { getFaqCategories, getQuestionsByCategory, getFaqQuestion } from '../../api/publicAPI';
import CategoryList from './CategoryList';
import QuestionList from './QuestionList';
import AnswerView from './AnswerView';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await getFaqCategories();
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to load FAQ categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = async (categoryId) => {
    setLoading(true);
    try {
      const res = await getQuestionsByCategory(categoryId);
      setQuestions(res.data.questions);
      setSelectedCategory(res.data.category);
      setSelectedQuestion(null);
    } catch (err) {
      console.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectQuestion = async (questionId) => {
    setLoading(true);
    try {
      const res = await getFaqQuestion(questionId);
      setSelectedQuestion(res.data);
    } catch (err) {
      console.error('Failed to load answer');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (selectedQuestion) {
      setSelectedQuestion(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
      setQuestions([]);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedCategory(null);
    setSelectedQuestion(null);
    setQuestions([]);
  };

  return (
    <>
      {/* Chatbot button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 bg-primary text-white rounded-full p-4 shadow-lg hover:bg-opacity-90 transition z-50"
      >
        💬
      </button>

      {/* Chatbot modal */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden border">
          <div className="bg-primary text-white px-4 py-3 flex justify-between items-center">
            <h3 className="font-serif">FAQ Assistant</h3>
            <button onClick={handleClose} className="text-white hover:text-gray-200">✕</button>
          </div>
          <div className="h-96 overflow-y-auto p-4">
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : selectedQuestion ? (
              <AnswerView question={selectedQuestion} onBack={handleBack} />
            ) : selectedCategory ? (
              <QuestionList
                category={selectedCategory}
                questions={questions}
                onSelectQuestion={handleSelectQuestion}
                onBack={handleBack}
              />
            ) : (
              <CategoryList categories={categories} onSelectCategory={handleSelectCategory} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;`
  },
  {
    path: 'src/components/Chatbot/CategoryList.jsx',
    content: `import React from 'react';

const CategoryList = ({ categories, onSelectCategory }) => {
  return (
    <div>
      <h4 className="font-semibold mb-3">Select a topic:</h4>
      <div className="space-y-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="w-full text-left p-3 bg-gray-100 rounded hover:bg-secondary transition"
          >
            <span className="text-xl mr-2">{cat.icon}</span>
            <span>{cat.name}</span>
            <p className="text-xs text-gray-600 mt-1">{cat.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;`
  },
  {
    path: 'src/components/Chatbot/QuestionList.jsx',
    content: `import React from 'react';

const QuestionList = ({ category, questions, onSelectQuestion, onBack }) => {
  return (
    <div>
      <button onClick={onBack} className="text-primary mb-3 flex items-center">
        ← Back to categories
      </button>
      <h4 className="font-semibold mb-3">{category.name}</h4>
      <div className="space-y-2">
        {questions.map(q => (
          <button
            key={q.id}
            onClick={() => onSelectQuestion(q.id)}
            className="w-full text-left p-3 bg-gray-100 rounded hover:bg-secondary transition"
          >
            {q.question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionList;`
  },
  {
    path: 'src/components/Chatbot/AnswerView.jsx',
    content: `import React from 'react';

const AnswerView = ({ question, onBack }) => {
  return (
    <div>
      <button onClick={onBack} className="text-primary mb-3 flex items-center">
        ← Back to questions
      </button>
      <h4 className="font-semibold mb-2">{question.question}</h4>
      <div className="bg-gray-50 p-4 rounded whitespace-pre-line">
        {question.answer}
      </div>
    </div>
  );
};

export default AnswerView;`
  },

  // New Admin Pages for FAQ and Chat Management
  {
    path: 'src/pages/Admin/FaqCategoriesAdmin.jsx',
    content: `import React, { useState, useEffect } from 'react';
import { getAdminFaqCategories, createFaqCategory, updateFaqCategory, deleteFaqCategory } from '../../api/adminAPI';
import Button from '../../components/UI/Button';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const FaqCategoriesAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', icon: '', display_order: 0, is_active: true });

  const fetchCategories = () => {
    setLoading(true);
    getAdminFaqCategories()
      .then(res => setCategories(res.data))
      .catch(err => setError('Failed to load categories'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateFaqCategory(editingId, form);
      } else {
        await createFaqCategory(form);
      }
      setForm({ name: '', description: '', icon: '', display_order: 0, is_active: true });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      setError('Operation failed');
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '', display_order: cat.display_order, is_active: cat.is_active });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This will also delete all questions in this category.')) {
      try {
        await deleteFaqCategory(id);
        fetchCategories();
      } catch (err) {
        setError('Delete failed');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-3xl font-serif mb-6">FAQ Categories</h1>
      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-8 space-y-4">
        <h2 className="text-xl font-semibold">{editingId ? 'Edit Category' : 'Add New Category'}</h2>
        <div>
          <label className="block mb-1">Name *</label>
          <input name="name" value={form.name} onChange={handleInputChange} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleInputChange} rows="2" className="w-full border rounded px-3 py-2"></textarea>
        </div>
        <div>
          <label className="block mb-1">Icon (emoji or icon class)</label>
          <input name="icon" value={form.icon} onChange={handleInputChange} className="w-full border rounded px-3 py-2" placeholder="e.g., 🙏, 📜" />
        </div>
        <div>
          <label className="block mb-1">Display Order</label>
          <input type="number" name="display_order" value={form.display_order} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex items-center">
          <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleInputChange} className="mr-2" />
          <label>Active</label>
        </div>
        <div className="flex space-x-2">
          <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
          {editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm({ name: '', description: '', icon: '', display_order: 0, is_active: true }); }}>Cancel</Button>}
        </div>
      </form>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Order</th>
              <th className="px-4 py-2 text-left">Icon</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Active</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} className="border-t">
                <td className="px-4 py-2">{cat.display_order}</td>
                <td className="px-4 py-2 text-2xl">{cat.icon}</td>
                <td className="px-4 py-2">{cat.name}</td>
                <td className="px-4 py-2">{cat.is_active ? '✅' : '❌'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => handleEdit(cat)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FaqCategoriesAdmin;`
  },
  {
    path: 'src/pages/Admin/FaqQuestionsAdmin.jsx',
    content: `import React, { useState, useEffect } from 'react';
import { getAdminFaqQuestions, createFaqQuestion, updateFaqQuestion, deleteFaqQuestion, getAdminFaqCategories } from '../../api/adminAPI';
import Button from '../../components/UI/Button';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const FaqQuestionsAdmin = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ category_id: '', question: '', answer: '', display_order: 0, is_active: true });

  const fetchData = () => {
    setLoading(true);
    Promise.all([getAdminFaqQuestions(), getAdminFaqCategories()])
      .then(([questionsRes, categoriesRes]) => {
        setQuestions(questionsRes.data);
        setCategories(categoriesRes.data);
      })
      .catch(err => setError('Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateFaqQuestion(editingId, form);
      } else {
        await createFaqQuestion(form);
      }
      setForm({ category_id: '', question: '', answer: '', display_order: 0, is_active: true });
      setEditingId(null);
      fetchData();
    } catch (err) {
      setError('Operation failed');
    }
  };

  const handleEdit = (q) => {
    setEditingId(q.id);
    setForm({ category_id: q.category_id, question: q.question, answer: q.answer, display_order: q.display_order, is_active: q.is_active });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteFaqQuestion(id);
        fetchData();
      } catch (err) {
        setError('Delete failed');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-3xl font-serif mb-6">FAQ Questions</h1>
      {error && <ErrorMessage message={error} />}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-8 space-y-4">
        <h2 className="text-xl font-semibold">{editingId ? 'Edit Question' : 'Add New Question'}</h2>
        <div>
          <label className="block mb-1">Category *</label>
          <select name="category_id" value={form.category_id} onChange={handleInputChange} required className="w-full border rounded px-3 py-2">
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Question *</label>
          <textarea name="question" value={form.question} onChange={handleInputChange} required rows="2" className="w-full border rounded px-3 py-2"></textarea>
        </div>
        <div>
          <label className="block mb-1">Answer *</label>
          <textarea name="answer" value={form.answer} onChange={handleInputChange} required rows="4" className="w-full border rounded px-3 py-2"></textarea>
        </div>
        <div>
          <label className="block mb-1">Display Order</label>
          <input type="number" name="display_order" value={form.display_order} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex items-center">
          <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleInputChange} className="mr-2" />
          <label>Active</label>
        </div>
        <div className="flex space-x-2">
          <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
          {editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm({ category_id: '', question: '', answer: '', display_order: 0, is_active: true }); }}>Cancel</Button>}
        </div>
      </form>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Question</th>
              <th className="px-4 py-2 text-left">Active</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map(q => (
              <tr key={q.id} className="border-t">
                <td className="px-4 py-2">{q.category_name}</td>
                <td className="px-4 py-2">{q.question.substring(0, 50)}...</td>
                <td className="px-4 py-2">{q.is_active ? '✅' : '❌'}</td>
                <td className="px-4 py-2 space-x-2">
                  <button onClick={() => handleEdit(q)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(q.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FaqQuestionsAdmin;`
  },
  {
    path: 'src/pages/Admin/ConversationsAdmin.jsx',
    content: `import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getConversations, updateConversationStatus } from '../../api/adminAPI';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import Button from '../../components/UI/Button';

const ConversationsAdmin = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchConversations = () => {
    setLoading(true);
    getConversations()
      .then(res => setConversations(res.data))
      .catch(err => setError('Failed to load conversations'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateConversationStatus(id, newStatus);
      fetchConversations();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-3xl font-serif mb-6">Manage Conversations</h1>
      {error && <ErrorMessage message={error} />}

      <div className="space-y-4">
        {conversations.map(conv => (
          <div key={conv.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{conv.subject || 'No subject'}</h3>
                <p className="text-sm text-gray-600">
                  User: {conv.user_name} ({conv.user_email})
                </p>
                <p className="text-sm text-gray-600">
                  Status: <span className="capitalize">{conv.status}</span>
                </p>
                {conv.admin_name && (
                  <p className="text-sm text-gray-600">Assigned to: {conv.admin_name}</p>
                )}
                <p className="text-xs text-gray-500">
                  Last message: {new Date(conv.last_message_at).toLocaleString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <Link to={\`/admin/chats/\${conv.id}\`}>
                  <Button variant="outline" size="sm">View</Button>
                </Link>
                <select
                  value={conv.status}
                  onChange={(e) => handleStatusChange(conv.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationsAdmin;`
  },
  {
    path: 'src/pages/Admin/AdminChat.jsx',
    content: `import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getConversationMessages, sendMessage } from '../../api/adminAPI';
import useAuth from '../../hooks/useAuth';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import Button from '../../components/UI/Button';

const AdminChat = () => {
  const { id } = useParams();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const fetchMessages = () => {
    setLoading(true);
    getConversationMessages(id)
      .then(res => {
        setConversation(res.data.conversation);
        setMessages(res.data.messages);
      })
      .catch(err => {
        setError('Failed to load messages');
        if (err.response?.status === 403) navigate('/admin/conversations');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setSending(true);
    try {
      await sendMessage(id, newMessage);
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-secondary px-6 py-4 border-b">
          <h2 className="text-xl font-serif">
            {conversation?.subject || 'Conversation'} 
          </h2>
          <p className="text-sm text-gray-600">
            User: {conversation?.user_name} ({conversation?.user_email})
          </p>
        </div>

        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={\`flex \${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}\`}
            >
              <div
                className={\`max-w-xs md:max-w-md rounded-lg px-4 py-2 \${
                  msg.sender_id === user.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-800'
                }\`}
              >
                <p className="text-sm font-semibold mb-1">{msg.sender_name}</p>
                <p>{msg.message}</p>
                <p className="text-xs text-right mt-1 opacity-75">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="border-t p-4 flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your reply..."
            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button type="submit" disabled={sending}>
            {sending ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminChat;`
  },

  // Updated AdminLayout with new menu items
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
            {/* New FAQ management */}
            <li><Link to="/admin/faq-categories" className="block p-2 hover:bg-gray-200 rounded">FAQ Categories</Link></li>
            <li><Link to="/admin/faq-questions" className="block p-2 hover:bg-gray-200 rounded">FAQ Questions</Link></li>
            {/* New Chat management */}
            <li><Link to="/admin/conversations" className="block p-2 hover:bg-gray-200 rounded">Conversations</Link></li>
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

  // Updated AppRoutes
  {
    path: 'src/routes/AppRoutes.jsx',
    content: `import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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

// New imports
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import UserDashboard from '../pages/User/UserDashboard';
import Chat from '../pages/User/Chat';
import FaqCategoriesAdmin from '../pages/Admin/FaqCategoriesAdmin';
import FaqQuestionsAdmin from '../pages/Admin/FaqQuestionsAdmin';
import ConversationsAdmin from '../pages/Admin/ConversationsAdmin';
import AdminChat from '../pages/Admin/AdminChat';

// Add ChatbotWidget to all pages
import ChatbotWidget from '../components/Chatbot/ChatbotWidget';

const AppRoutes = () => {
  return (
    <>
      <ChatbotWidget />
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

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
          <Route path="faq-categories" element={<FaqCategoriesAdmin />} />
          <Route path="faq-questions" element={<FaqQuestionsAdmin />} />
          <Route path="conversations" element={<ConversationsAdmin />} />
          <Route path="chats/:id" element={<AdminChat />} />
          {/* Add other admin routes as needed */}
        </Route>

        {/* User routes (protected) */}
        <Route path="/user/dashboard" element={<PrivateRoute><Layout><UserDashboard /></Layout></PrivateRoute>} />
        <Route path="/user/chat/:id" element={<PrivateRoute><Layout><Chat /></Layout></PrivateRoute>} />
      </Routes>
    </>
  );
};

export default AppRoutes;`
  }
];

// ============================================
// Create folders and files
// ============================================
function addFeatures() {
  files.forEach(file => {
    const fullPath = path.join(process.cwd(), file.path);
    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }

    fs.writeFileSync(fullPath, file.content);
    console.log(`Created/Updated file: ${file.path}`);
  });

  console.log('\n✅ React frontend features added successfully!');
  console.log('\n📦 Next steps:');
  console.log('1. Make sure your backend is running with the new features.');
  console.log('2. Run: npm start');
  console.log('3. Navigate to /register to create a user account, then /login.');
  console.log('4. The chatbot will appear at the bottom left of all pages.\n');
}

addFeatures();