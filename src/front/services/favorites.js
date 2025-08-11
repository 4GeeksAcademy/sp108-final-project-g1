const host = import.meta.env.VITE_BACKEND_URL;

const token = localStorage.getItem('token') || sessionStorage.getItem('token')

export const getFavorites = async () => {
  const response = await fetch(`${host}api/favorites`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Error al obtener favoritos');
  return await response.json();
};

export const addFavorite = async (hutId) => {
  const response = await fetch(`${host}api/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
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
  const response = await fetch(`${host}api/favorites/${favoriteId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al eliminar favorito');
  }
  return await response.json();
};
