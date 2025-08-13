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
        const response = await fetch(`${host}api/register`, {
            method: 'POST',
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify(dataToSend)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al registrar');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en register:', error);
        throw error;
    }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await fetch(`${host}api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al solicitar recuperación');
    }

    return await response.json();
  } catch (error) {
    console.error("Error al solicitar recuperación:", error);
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await fetch(`${host}api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, new_password: newPassword })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al restablecer contraseña');
    }

    return await response.json();
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    throw error;
  }
};