import React, { useEffect } from 'react'
import { getFavorites, addFavorite, removeFavorite } from '../services/favorites'
import useGlobalReducer from '../hooks/useGlobalReducer'
import { Link, useNavigate } from 'react-router-dom'


export const Favorites = () => {
  const { store, dispatch } = useGlobalReducer()
  const navigate = useNavigate()

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const { results } = await getFavorites()
        dispatch({ type: 'favorites', payload: results })
      } catch (error) { }
    }
    loadFavorites()
  }, [dispatch])

  const handleFavorite = async hutId => {
    try {
      const existing = store.favorites.find(fav => fav.hut_id === hutId)
      if (existing) {
        await removeFavorite(existing.id)
        dispatch({ type: 'remove_favorites', payload: existing.id })
      } else {
        const result = await addFavorite(hutId)
        dispatch({ type: 'add_favorites', payload: result.results })
      }
    } catch (err) { }
  }

  const isFavorite = hutId => store.favorites.some(favorite => favorite.hut_id === hutId)

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-black/50 min-h-screen">
      <h1 className="text-4xl text-center md:text-6xl lg:text-8xl font-bold tracking-tight mb-6">
        <span className='bg-gradient-to-br from-brown-450 to-brown-250 bg-clip-text text-transparent'>Tus Cabañas Favoritas</span>
      </h1>
      <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50 mb-8"></div>

      {store.favorites.length === 0 ? (
        <div className="bg-brown-150 border-2 border-brown-250 rounded-lg p-8 text-center shadow-sm">
          <p className="text-brown-550 text-xl mb-6">No tienes reservas actualmente</p>
          <button
            onClick={() => navigate('/huts')}
            className="bg-green-350 hover:bg-green-450 text-white font-bold py-3 px-8 rounded-md shadow-md transition-all hover:shadow-lg"
          >
            Explorar Cabañas Disponibles
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {store.favorites.map(favorite => (
            <div key={favorite.id} className="relative bg-white rounded-lg shadow-md overflow-hidden border-4 border-brown-250">
              { !store.currentUser.is_admin && (
                <button
                  onClick={() => handleFavorite(favorite.hut_id)}
                  className='absolute z-50 inline-flex items-center justify-center w-12 h-8 text-xs font-bold bg-neutral-100 border-2 border-black rounded-full top-2 end-2'
                >
                  {isFavorite(favorite.hut_id) ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-red-400 icon icon-tabler icons-tabler-filled icon-tabler-heart"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bg-red icon icon-tabler icons-tabler-outline icon-tabler-heart"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg>
                  )}
                </button>
              )}
              <img
                src={favorite.hut_image_url}
                alt={favorite.hut_name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-brown-550">{favorite.hut_name}</h2>
                <Link
                  to={`/huts/${favorite.hut_id}`}
                  className="flex-none basis-1/2 md:basis-1/4 bg-gradient-to-br from-brown-250 to-green-250 rounded-3xl border border-brown-250 text-center p-2 hover:scale-[1.02] text-white"
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
