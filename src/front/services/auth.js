const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Función auxiliar para manejar las respuestas HTTP
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    const errorMsg = errorData.message || 'Error en la solicitud';
    throw new Error(errorMsg);
  }
  return response.json();
};

export const login = async (dataToSend) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(dataToSend),
      credentials: 'include' // Para manejar cookies si es necesario
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error en login:', error.message);
    throw new Error(error.message || 'Error al iniciar sesión');
  }
};

export const register = async (dataToSend) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(dataToSend),
      credentials: 'include' // Para manejar cookies si es necesario
    });
    
    return await handleResponse(response);
  } catch (error) {
    console.error('Error en register:', error.message);
    throw new Error(error.message || 'Error al registrar usuario');
  }
};

// Función para manejar alertas (si es necesario)
export const handleAlert = (dispatch, message, type = 'error') => {
  dispatch({
    type: 'handle_alert',
    payload: { message, type }
  });
};