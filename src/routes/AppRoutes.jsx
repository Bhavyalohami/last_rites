import React from 'react';
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
import ObituariesAdmin from '../pages/Admin/ObituariesAdmin';
import TestimonialsAdmin from '../pages/Admin/TestimonialsAdmin';
import MessagesAdmin from '../pages/Admin/MessagesAdmin';
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
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route
          path="/services"
          element={
            <Layout>
              <Services />
            </Layout>
          }
        />
        <Route
          path="/services/:id"
          element={
            <Layout>
              <ServiceDetail />
            </Layout>
          }
        />
        <Route
          path="/obituaries"
          element={
            <Layout>
              <Obituaries />
            </Layout>
          }
        />
        <Route
          path="/obituaries/:id"
          element={
            <Layout>
              <ObituaryDetail />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <Contact />
            </Layout>
          }
        />
        <Route
          path="/resources"
          element={
            <Layout>
              <Resources />
            </Layout>
          }
        />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
          <Route path="faq-categories" element={<FaqCategoriesAdmin />} />
          <Route path="faq-questions" element={<FaqQuestionsAdmin />} />
          <Route path="conversations" element={<ConversationsAdmin />} />
          <Route path="chats/:id" element={<AdminChat />} />
          {/* Add other admin routes as needed */}
          <Route path="obituaries" element={<ObituariesAdmin />} />
          <Route path="testimonials" element={<TestimonialsAdmin />} />
          <Route path="messages" element={<MessagesAdmin />} />
        </Route>

        {/* User routes (protected) */}
        <Route
          path="/user/dashboard"
          element={
            <PrivateRoute role="user" redirectTo="/login">
              <Layout>
                <UserDashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/user/chat/:id"
          element={
            <PrivateRoute role="user" redirectTo="/login">
              <Layout>
                <Chat />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default AppRoutes;
