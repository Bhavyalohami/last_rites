import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loader from '../components/common/Loader';

const PrivateRoute = ({ children, role, redirectTo = '/admin/login' }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return <Loader />;
  if (!isAuthenticated) return <Navigate to={redirectTo} replace />;
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />;
  }
  return children;
};

export default PrivateRoute;
