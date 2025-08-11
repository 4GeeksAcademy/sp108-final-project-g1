import React, { useState, useEffect } from 'react'
import { Form, useNavigate } from 'react-router-dom'
import { getBookingsDetail } from '../services/book'
import useGlobalReducer from "../hooks/useGlobalReducer"
import { calculateNights, calculateTotalStayCost } from '../tools/utilFunctions'
import { postReview } from '../services/reviews'
import { toast } from 'react-toastify';

const StarRating = ({ rating = 0, onRatingChange = () => { } }) => {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div className="flex justify-center my-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="focus:outline-none"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
        >
          <svg
            className={`w-8 h-8 mx-1 ${star <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        </button>
      ))}
    </div>
  )
}

const Bookings = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [activeBooking, setActiveBooking] = useState(null)
  const { store, dispatch } = useGlobalReducer()
  const bookings = store.bookingsDetail
  const currentUser = store.currentUser
  const [formData, setFormData] = useState({
    title: "",
    comment: "",
    rating: 4
  })

  useEffect(() => {
    const getBookings = async () => {
      try {
        const bookingsData = await getBookingsDetail()
        dispatch({ type: "bookingsDetail", payload: bookingsData })
      } catch (err) {
        setError(err.message)
        if (err.message.includes('Sesión expirada')) {
          localStorage.removeItem('token')
          sessionStorage.removeItem('token')
        }
      } finally {
        setLoading(false)
      }
    }
    getBookings()
  }, [])

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('es-ES', options)
  }

  const handleReview = async (event) => {
    event.preventDefault()
    try {
      if (!formData.title.trim() || !formData.comment.trim()) {
        toast.warning('Por favor completa todos los campos', {
          position: "top-center",
          autoClose: 3000,
          theme: "colored"
        })
        return
      }

      if (!activeBooking) throw new Error("No se encontró la reserva")

      const newReview = await postReview(activeBooking.hut_to.id, formData)

      dispatch({ type: 'reviews', payload: newReview })

      setFormData({
        title: "",
        comment: "",
        rating: 4
      })
      setIsOpen(false)
      setActiveBooking(null)
      toast.success('La reseña se ha añadido correctamente.', {
        position: "top-center",
        autoClose: 3000,
        theme: "colored"
      })

    } catch (error) {
      console.error("Error al enviar reseña:", error)
      alert(error.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brown-150 flex items-center justify-center">
        <div className="text-green-550 text-xl animate-pulse">Cargando tus reservas...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-brown-150 flex flex-col items-center justify-center p-6">
        <div className="bg-brown-250/50 p-6 rounded-lg max-w-md text-center">
          <p className="text-brown-550 text-xl mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-green-350 hover:bg-green-450 text-white font-bold py-2 px-6 rounded-md transition-colors"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 bg-black/50 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-4xl text-center md:text-6xl lg:text-8xl font-bold tracking-tight mb-6">
          <span className='bg-gradient-to-br from-brown-450 to-brown-250 bg-clip-text text-transparent'>Mis reservas</span>
        </h1>
        <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50 mb-8"></div>

        {bookings.length === 0 ? (
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
          <div className="space-y-6 max-w-5xl mx-auto">
            {bookings.map((booking) => (
              <div key={booking.id} className="bookings-target border-4 border-brown-250 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="mb-6 md:mb-0 md:w-2/3">
                      <h2 className="text-2xl font-bold text-brown-550 mb-2">{booking.hut_to.name}</h2>
                      <p className="text-green-450 font-medium mb-4">{booking.hut_to.location_to.city}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm">Check-in</p>
                          <p className="font-medium text-brown-550">{formatDate(booking.start_date)}</p>
                        </div>
                        <div>
                          <p className="text-sm">Check-out</p>
                          <p className="font-medium text-brown-550">{formatDate(booking.end_date)}</p>
                        </div>
                        <div>
                          <p className="text-sm">Noches</p>
                          <p className="font-medium text-brown-550">
                            {calculateNights(booking.start_date, booking.end_date)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm">Huéspedes</p>
                          <p className="font-medium text-brown-550">{booking.guests}</p>
                        </div>
                      </div>
                    </div>

                    <div className="md:w-1/3 md:pl-6">
                      <div className="bg-green-150 p-4 rounded-lg border border-green-250">
                        <p className="text-sm text-brown-450 mb-1">Total</p>
                        <p className="text-2xl font-bold text-brown-550 mb-4">
                          {calculateTotalStayCost(booking.hut_to.price_per_night, calculateNights(booking.start_date, booking.end_date))} €
                        </p>
                      </div>
                      <div className='flex gap-2 mt-4 text-center'>
                        {currentUser.is_admin && (
                          <button
                            onClick={() => navigate(`/profile`)}
                            className="flex-1 bg-brown-450 hover:bg-brown-550 text-white rounded-md mt-4 p-2 transition-colors"
                          >Huesped</button>
                        )}
                        {!currentUser.is_admin && (
                          <button onClick={() => {
                            setActiveBooking(booking)
                            setIsOpen(true)
                          }}
                            className='flex-1 bg-brown-450 hover:bg-brown-550 text-white rounded-md mt-4 p-2 transition-colors'>
                            Deja tu reseña
                          </button>
                        )}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => navigate(`/current-booking/${booking.hut_to.id}`)}
                          className="flex-1 bg-brown-450 hover:bg-brown-550 text-white font-medium py-2 px-4 rounded-md transition-colors"
                        >
                          Ver Reserva
                        </button>
                        <button
                          onClick={() => navigate(`/huts/${booking.hut_to.id}`)}
                          className="flex-1 bg-brown-450 hover:bg-brown-550 text-white font-medium py-2 px-4 rounded-md transition-colors"
                        >
                          Ver Cabaña
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {booking.status === 'pending' && (
                  <div className="bg-green-250/50 px-6 py-3 border-t border-green-350">
                    <p className="text-green-550 font-medium flex items-center">
                      <span className="inline-block w-3 h-3 rounded-full bg-green-350 mr-2"></span>
                      Confirmación pendiente
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <Form onSubmit={handleReview} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex flex-col sm:flex-row items-start gap-4 border-b p-4">
              <div className="flex-1">
                <div className="flex flex-col justify-between items-start gap-4">
                  <h3 className='flex mx-auto'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-pencil mr-2">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                      <path d="M13.5 6.5l4 4" />
                    </svg>
                    Comparte tu experiencia!
                  </h3>
                  <input
                    type="text"
                    className='w-full border-2 border-gray-300 rounded-md p-2'
                    placeholder='Título'
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  <textarea
                    className='w-full min-h-[100px] md:min-h-[200px] max-h-[250px] md:max-h-[400px] border-2 border-gray-300 rounded-md p-2'
                    placeholder='Escribe aquí'
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  />

                  <div className="w-full text-center">
                    <p className="text-sm text-gray-600 mb-2">Valora tu experiencia</p>
                    <StarRating
                      rating={formData.rating}
                      onRatingChange={(value) => setFormData({ ...formData, rating: value })}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.rating} {formData.rating === 1 ? 'estrella' : 'estrellas'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 border-t p-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-br from-brown-550 to-green-450 rounded-3xl border border-brown-250 hover:scale-[1.02] text-white"
              >
                Aceptar
              </button>
            </div>
          </div>
        </Form>
      )}
    </div>
  )
}

export default Bookings
