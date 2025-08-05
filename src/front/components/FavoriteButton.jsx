// components/FavoriteButton.jsx
import React, { useState, useEffect } from 'react';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { addFavorite, removeFavorite, getFavorites } from '../services/favorites';
import useGlobalReducer from '../hooks/useGlobalReducer';

export const FavoriteButton = ({ hutId }) => {
  const { store, dispatch } = useGlobalReducer();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Verificar si la cabaña está en favoritos al cargar
    const checkFavorite = async () => {
      try {
        const { results } = await getFavorites();
        const favorite = results.find(fav => fav.hut_id === hutId);
        if (favorite) {
          setIsFavorite(true);
          setFavoriteId(favorite.id);
        }
      } catch (error) {
        console.error("Error checking favorite:", error);
      }
    };
    
    checkFavorite();
  }, [hutId]);

  const handleToggleFavorite = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      if (isFavorite) {
        await removeFavorite(favoriteId);
        dispatch({ 
          type: 'remove_favorite', 
          payload: hutId 
        });
      } else {
        const { results } = await addFavorite(hutId);
        setFavoriteId(results.id);
        dispatch({ 
          type: 'add_favorite', 
          payload: { 
            id: results.id,
            hut_id: hutId,
            user_id: store.currentUser.id,
            hut_name: store.hutsDetail.find(h => h.id === hutId)?.name,
            hut_image_url: store.hutsDetail.find(h => h.id === hutId)?.image_url
          } 
        });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Mostrar mensaje de error al usuario
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`p-2 rounded-full transition-colors ${
        isFavorite 
          ? 'text-brown-550 bg-brown-150 hover:bg-brown-250'
          : 'text-brown-350 bg-white/80 hover:bg-brown-150'
      } shadow-md backdrop-blur-sm`}
      aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      {isFavorite ? (
        <HeartIconSolid className="h-6 w-6" />
      ) : (
        <HeartIconOutline className="h-6 w-6" />
      )}
    </button>
  );
};