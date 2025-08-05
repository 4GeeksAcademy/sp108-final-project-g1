// services/favorites.js
const API_URL = import.meta.env.VITE_BACKEND_URL;

export const getFavorites = async () => {
  const response = await fetch(`${API_URL}/hut-favorites`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  if (!response.ok) throw new Error('Error al obtener favoritos');
  return await response.json();
};

export const addFavorite = async (hutId) => {
  const response = await fetch(`${API_URL}/hut-favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ hut_id: hutId })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al agregar favorito');
  }
  
  return await response.json();
};

export const removeFavorite = async (favoriteId) => {
  const response = await fetch(`${API_URL}/hut-favorites/${favoriteId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al eliminar favorito');
  }
  
  return await response.json();
};