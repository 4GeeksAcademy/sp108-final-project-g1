// src/api/auth.js

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '');

/**
 * Función para manejar todas las peticiones API
 */
const apiRequest = async (endpoint, method, body = null) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest"
      },
      credentials: 'include',
      mode: 'cors',
      body: body ? JSON.stringify(body) : null
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `Error HTTP: ${response.status}`
      }));
      throw new Error(errorData.message || 'Error en la solicitud');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en ${method} ${endpoint}:`, error);
    throw error;
  }
};

// Servicios específicos
export const authService = {
  register: (userData) => apiRequest('/api/register', 'POST', userData),
  login: (credentials) => apiRequest('/api/login', 'POST', credentials)
};

// Función para manejar alertas (opcional)
export const showAlert = (dispatch, message, type = 'error') => {
  dispatch({
    type: 'SET_ALERT',
    payload: { message, type }
  });
  
  setTimeout(() => dispatch({ type: 'CLEAR_ALERT' }), 5000);
};