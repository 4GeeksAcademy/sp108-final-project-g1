const host = import.meta.env.VITE_BACKEND_URL;

export const getFavorites = async () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  const response = await fetch(`${host}api/favorites`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Error al obtener favoritos');
  return await response.json();
};

export const addFavorite = async (hutId) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
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
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
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
