import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { getHutsDetail } from '../services/hut'
import { createBooking } from '../services/book'
import { getFavorites, addFavorite, removeFavorite } from '../services/favorites'
import useGlobalReducer from '../hooks/useGlobalReducer'
import { format } from 'date-fns'


const Huts = () => {
  const { store, dispatch } = useGlobalReducer()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedHut, setSelectedHut] = useState(null)
  const isLogged = store.isLogged || !!store.token || !!localStorage.getItem('token') || !!sessionStorage.getItem('token')
  const [bookingData, setBookingData] = useState({
    start_date: '',
    end_date: '',
    guests: 1,
    special_requests: ''
  })
  const [bookingError, setBookingError] = useState(null)
  const [bookingSuccess, setBookingSuccess] = useState(false)

  useEffect(() => {
    const fetchHuts = async () => {
      try {
        setLoading(true)
        setError(null)
        const hutsData = await getHutsDetail()
        if (!hutsData) {
          throw new Error('No se recibieron datos de las cabañas')
        }
        dispatch({ type: 'hutsDetail', payload: hutsData })
      } catch (err) {
        setError({
          message: 'No se pudo cargar la información de las cabañas',
          details: err.message
        })
      } finally {
        setLoading(false)
      }
    }
    fetchHuts()
  }, [dispatch])

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isLogged) return
      try {
        const res = await getFavorites()
        dispatch({ type: 'favorites', payload: res.results })
      } catch (err) { }
    }
    fetchFavorites()
  }, [isLogged, dispatch])

  const handleReserveClick = (hut) => {
    setSelectedHut(hut)
    setShowModal(true)
    setBookingData({
      start_date: '',
      end_date: '',
      guests: 1,
      special_requests: ''
    })
    setBookingError(null)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedHut(null)
    setBookingSuccess(false)
  }

  const handleBookingChange = (e) => {
    const { name, value } = e.target
    setBookingData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) : value
    }))
  }

  const handleBookingSubmit = async (event) => {
    event.preventDefault()
    setBookingError(null)
    if (!bookingData.start_date || !bookingData.end_date) {
      setBookingError('Debes seleccionar fechas de inicio y fin')
      return
    }
    try {
      const bookingPayload = {
        hut_id: selectedHut.id,
        start_date: bookingData.start_date,
        end_date: bookingData.end_date,
        guests: bookingData.guests,
        special_requests: bookingData.special_requests
      }
      const response = await createBooking(bookingPayload)
      if (response.success) {
        setBookingSuccess(true)
        dispatch({ type: 'bookingsDetail', payload: bookingPayload })
        setBookingError(null)
      } else {
        throw new Error(response.message || 'Error al realizar la reserva')
      }
    } catch (err) {
      setBookingError(err.message || 'Error al procesar la reserva')
    }
  }

  const handleFavorite = async (hut) => {
    try {
      const existing = store.favorites.find(fav => fav.hut_id === hut.id)
      if (existing) {
        await removeFavorite(existing.id)
        dispatch({ type: 'remove_favorites', payload: existing.id })
      } else {
        const result = await addFavorite(hut.id)
        dispatch({ type: 'add_favorites', payload: result.results })
      }
    } catch (err) { }
  }

  const isFavorite = (hutId) => {
    return store.favorites.some(favorite => favorite.hut_id === hutId)
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-550 mb-4"></div>
      <p className="text-lg text-brown-550">Cargando cabañas...</p>
    </div>
  )

  if (error) return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-red-50 rounded-xl border border-red-100 text-center">
      <h3 className="text-xl font-semibold text-red-600 mb-3">Error al cargar las cabañas</h3>
      <p className="text-red-500 mb-5">{error.message}</p>
      <button
        onClick={() => window.location.reload()}
        className="px-5 py-2.5 bg-green-350 text-white font-medium rounded-lg hover:bg-green-450 transition-colors"
      >
        Reintentar
      </button>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-12 bg-black/50 min-h-screen">
      <h1 className="text-4xl text-center md:text-6xl lg:text-8xl font-bold tracking-tight mb-6">
        <span className='bg-gradient-to-br from-brown-450 to-brown-250 bg-clip-text text-transparent'>
          Nuestras Cabañas
        </span>
      </h1>
      <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50 mb-8"></div>

      {store.currentUser?.is_admin && (
        <div
          className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 mb-10 border-2 border-dashed border-green-350 flex flex-col items-center justify-center cursor-pointer h-full min-h-[320px] sm:min-h-[350px] md:min-h-[380px]"
          onClick={() => window.location.href = '/huts/new'}
        >
          <div className="text-center p-5 w-full">
            <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-green-100 mb-3">
              <svg
                className="h-8 w-8 text-green-550"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-green-550 mb-1">Añadir cabaña</h3>
            <p className="text-sm text-brown-450 px-2">Crear nueva cabaña</p>
          </div>
        </div>
      )}

      {store.hutsDetail.length === 0 ? (
        <div className="max-w-lg mx-auto bg-brown-50 rounded-xl p-8 text-center">
          <p className="text-xl text-brown-550 mb-6">No hay cabañas disponibles</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-green-350 text-white font-medium rounded-lg hover:bg-green-450 transition-colors"
          >
            Reintentar
          </button>
        </div>
      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {store.hutsDetail.map((hut) => (
            <div
              key={hut.id}
              className="relative bg-white border-4 border-brown-250 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {isLogged && !store.currentUser?.is_admin && (
                <button onClick={() => handleFavorite(hut)}
                  className='absolute z-40 inline-flex items-center justify-center w-12 h-8 text-xs font-bold bg-neutral-100 border-2 border-black rounded-full top-2 end-2'>
                  {isFavorite(hut.id) ?
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-red-400 icon icon-tabler icons-tabler-filled icon-tabler-heart"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" /></svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bg-red icon icon-tabler icons-tabler-outline icon-tabler-heart"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" /></svg>
                  }
                </button>
              )}
              <div className="fixed bottom-6 right-6 z-50">
                <button
                  onClick={() => window.location.href = '/maps'}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Abrir Mapa
                </button>
              </div>
              <div className="relative">
                <img
                  src={hut.image_url || 'https://via.placeholder.com/400x300'}
                  alt={hut.name || 'Cabaña'}
                  className="w-full h-60 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300'
                    e.target.alt = 'Imagen no disponible'
                  }}
                />

              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-bold text-green-550 truncate">{hut.name || 'Cabaña'}</h2>
                  <span className="text-lg font-semibold text-brown-550 whitespace-nowrap">
                    ${hut.price_per_night || '0'}<span className="text-sm font-normal text-brown-350">/noche</span>
                  </span>
                </div>

                <p className="text-brown-450 mb-4 line-clamp-2 min-h-[80px] overflow-y-auto">{hut.description || 'Descripción no disponible'}</p>

                <div className="grid grid-cols-3 gap-2 mb-5">
                  <div className="bg-green-100 rounded-lg p-2 text-center">
                    <p className="text-xs text-green-550">Huéspedes</p>
                    <p className="font-semibold text-brown-550">{hut.capacity || '-'}</p>
                  </div>
                  <div className="bg-green-100 rounded-lg p-2 text-center">
                    <p className="text-xs text-green-550">Dormitorios</p>
                    <p className="font-semibold text-brown-550">{hut.bedrooms || '-'}</p>
                  </div>
                  <div className="bg-green-100 rounded-lg p-2 text-center">
                    <p className="text-xs text-green-550">Baños</p>
                    <p className="font-semibold text-brown-550">{hut.bathroom || '-'}</p>
                  </div>
                </div>

                <div className="flex justify-between gap-3">
                  <Link
                    to={`/huts/${hut.id}`}
                    className="flex-1 bg-gradient-to-br from-brown-250 to-green-250 rounded-3xl border border-brown-250 text-center text-sm md:text-base md:w-1/4 p-2 hover:scale-[1.02] text-white"
                  >
                    Ver detalles
                  </Link>
                  {
                    !store.currentUser.is_admin && (
                  <button
                    onClick={() => handleReserveClick(hut)}
                    className="flex-1 bg-gradient-to-br from-brown-550 to-green-450 rounded-3xl border border-brown-250 text-center text-sm md:text-base md:w-1/4 p-2 hover:scale-[1.02] text-white"
                  >
                    Reservar
                  </button>
                    )
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedHut && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-5 bg-green-100 border-b">
              <h3 className="text-xl font-bold text-green-550">
                {isLogged ? `Reservar ${selectedHut.name}` : 'Regístrate para reservar'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-brown-550 hover:text-brown-350 text-2xl"
                aria-label="Cerrar modal"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              {bookingSuccess ? (
                <div className="text-center">
                  <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <h3 className="text-lg font-medium text-green-550 mt-4">¡Reserva confirmada!</h3>
                  <p className="mt-2 text-brown-450">
                    Tu reserva en {selectedHut.name} ha sido confirmada.
                  </p>
                  <button
                    onClick={() => window.location.href = '/bookings'}
                    className="mt-6 w-full py-3 bg-green-350 text-white font-medium rounded-lg hover:bg-green-450 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              ) : isLogged ? (
                <form onSubmit={handleBookingSubmit}>
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brown-550 mb-1">
                          Fecha de llegada
                        </label>
                        <input
                          type="date"
                          name="start_date"
                          value={bookingData.start_date}
                          onChange={handleBookingChange}
                          min={format(new Date(), 'yyyy-MM-dd')}
                          className="w-full p-2 border border-brown-200 rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brown-550 mb-1">
                          Fecha de salida
                        </label>
                        <input
                          type="date"
                          name="end_date"
                          value={bookingData.end_date}
                          onChange={handleBookingChange}
                          min={bookingData.start_date || format(new Date(), 'yyyy-MM-dd')}
                          className="w-full p-2 border border-brown-200 rounded-lg"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brown-550 mb-1">
                        Huéspedes (máx. {selectedHut.capacity})
                      </label>
                      <input
                        type="number"
                        name="guests"
                        min="1"
                        max={selectedHut.capacity}
                        value={bookingData.guests}
                        onChange={handleBookingChange}
                        className="w-full p-2 border border-brown-200 rounded-lg"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brown-550 mb-1">
                        Solicitudes especiales
                      </label>
                      <textarea
                        name="special_requests"
                        value={bookingData.special_requests}
                        onChange={handleBookingChange}
                        rows="3"
                        className="w-full p-2 border border-brown-200 rounded-lg"
                      />
                    </div>
                  </div>

                  {bookingError && (
                    <div className="mb-4 p-3 bg-red-100 text-red-600 rounded text-sm">
                      {bookingError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-green-350 text-white font-medium rounded-lg hover:bg-green-450 transition-colors"
                  >
                    Confirmar Reserva
                  </button>
                </form>
              ) : (
                <button
                  className='btn px-4 py-2 bg-white text-sm md:text-base border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duración-200'
                  onClick={() => window.location.href = '/login'}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Huts
