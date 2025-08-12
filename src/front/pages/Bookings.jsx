import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getBookingsDetail, deleteBooking } from '../services/book';
import useGlobalReducer from "../hooks/useGlobalReducer";
import { calculateNights, calculateTotalStayCost } from '../tools/utilFunctions';
import BuyButtonComponent from '../components/BuyButton';


const Bookings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();
  const bookings = store.bookingsDetail;
  const currentUser = store.currentUser;

  useEffect(() => {
    const getBookings = async () => {
      try {
        const bookingsData = await getBookingsDetail();
        dispatch({ type: "bookingsDetail", payload: bookingsData });
      } catch (err) {
        setError(err.message);
        if (err.message.includes('Sesión expirada')) {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
        }
      } finally {
        setLoading(false);
      }
    };
    getBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    const isactive = window.confirm('¿Estás seguro que deseas cancelar esta reserva?');
    if (!isactive) return;
    setCancellingId(bookingId);
    try {
      await deleteBooking(bookingId);
      const bookingsData = await getBookingsDetail();
      dispatch({ type: "bookingsDetail", payload: bookingsData });
      setSuccessMessage('Reserva cancelada exitosamente');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message);
      if (err.message.includes('Sesión expirada')) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
      }
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-brown-150 flex items-center justify-center">
        <div className="text-green-550 text-xl animate-pulse">Cargando tus reservas...</div>
      </div>
    );
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
    );
  }

  return (
    <div className="min-h-screen bg-brown-150 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-brown-550 mb-2">Mis Reservas</h1>
          <div className="w-24 h-1 bg-green-350 mx-auto"></div>
        </div>

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
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-brown-150 border-2 border-brown-250 rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="mb-6 md:mb-0 md:w-2/3">
                      <h2 className="text-2xl font-bold text-brown-550 mb-2">{booking.hut_to.name}</h2>
                      <p className="text-green-450 font-medium mb-4">{booking.hut_to.location_to.city}</p>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-brown-450">Check-in</p>
                          <p className="font-medium text-brown-550">{formatDate(booking.start_date)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-brown-450">Check-out</p>
                          <p className="font-medium text-brown-550">{formatDate(booking.end_date)}</p>
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <div>
                          <p className="text-sm text-brown-450">Noches</p>
                          <p className="font-medium text-brown-550">
                            {calculateNights(booking.start_date, booking.end_date)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-brown-450">Huéspedes</p>
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
                      <div className="mt-4 space-y-3 p-4 bg-white rounded-lg">
                        {/* Fila de botones superiores */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          {currentUser.is_admin && (
                            <button
                              onClick={() => navigate(`/profile/${booking.user_id}`)}
                              className="flex-1 bg-amber-700 hover:bg-amber-800 text-white py-2 px-4 rounded-md transition-colors duration-200 text-sm sm:text-base shadow-md"
                            >
                              Ver Huésped
                            </button>
                          )}
                          <button className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md transition-colors duration-200 text-sm sm:text-base shadow-md">
                            Deja tu reseña
                          </button>
                        </div>

                        {/* Fila de botones inferiores */}
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => navigate(`/current-booking/${booking.hut_to.id}`)}
                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md transition-colors duration-200 text-sm sm:text-base shadow-md"
                          >
                            Ver Reserva
                          </button>
                          <button
                            onClick={() => navigate(`/huts/${booking.hut_to.id}`)}
                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md transition-colors duration-200 text-sm sm:text-base shadow-md"
                          >
                            Ver Cabaña
                          </button>
                        </div>

                        {/* Botones especiales (Stripe y Cancelar) */}
                        <div className="flex-column"
                        >
                          {!currentUser.is_admin && (
                            <stripe-buy-button
                              buy-button-id="buy_btn_1Rv7GQEtAORreSL7tnocAHYB"
                              publishable-key="pk_test_51RqDDmEtAORreSL72MG2GvWCRmOpqvFUiavX1SxF0mCGgSfboGFJzfNojRPTzYJlU9uHBVVLxytkxbctJQd9wUpG00qklO3xus"
                            >
                            </stripe-buy-button>
                          )}
                          {(booking.status_reserved === 'active' &&
                            (currentUser.id === booking.user_id || currentUser.is_admin)) && (
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={cancellingId === booking.id}
                                className={`flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base shadow-md ${cancellingId === booking.id ? 'opacity-75' : ''
                                  }`}
                              >
                                {cancellingId === booking.id ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Cancelando...
                                  </>
                                ) : (
                                  'Cancelar Reserva'
                                )}
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {booking.status_reserved === 'pending' && (
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
    </div>
  );
};

export default Bookings;