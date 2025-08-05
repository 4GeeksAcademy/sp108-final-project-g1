// pages/Favorites.jsx
import React, { useEffect } from 'react';
import { getFavorites } from '../services/favorites';
import useGlobalReducer from '../hooks/useGlobalReducer';

export const Favorites = () => {
  const { store, dispatch } = useGlobalReducer();

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const { results } = await getFavorites();
        dispatch({ type: 'favorites', payload: results });
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };
    
    loadFavorites();
  }, [dispatch]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-brown-550 mb-6">Tus Cabañas Favoritas</h1>
      
      {store.favorites.length === 0 ? (
        <p className="text-brown-350">No tienes cabañas favoritas aún</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {store.favorites.map(favorite => (
            <div key={favorite.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-brown-150">
              <img
                src={favorite.hut_image_url}
                alt={favorite.hut_name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-brown-550">{favorite.hut_name}</h2>
                {/* Más detalles de la cabaña */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};