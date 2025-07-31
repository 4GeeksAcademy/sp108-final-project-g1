import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  // Obtener el token y los datos del usuario
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const user = token ? JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || '{}') : null;

  // Si no hay token, redirigir a login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta es solo para admin pero el usuario no es admin
  if (adminOnly && (!user || !user.is_admin)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si todo está bien, renderizar los children
  return children;
};