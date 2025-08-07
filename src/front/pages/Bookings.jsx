import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookingsDetail } from '../services/book';
import useGlobalReducer from "../hooks/useGlobalReducer";
import { calculateNights, calculateTotalStayCost } from '../tools/utilFunctions';







const Bookings = () => {
  // const [bookings, setBookings] = useState([]); //ALVARO COMO NO VISTE ESTO
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const { store, dispatch } = useGlobalReducer();
  
  const bookings = store.bookingsDetail
  
  const currentUser = store.currentUser

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
      }
      finally {
        setLoading(false); // Siempre se ejecuta, haya éxito o error
      }
    };
    getBookings();
  }, []);
  





  // Formatear fecha
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
                          $ {calculateTotalStayCost(booking.hut_to.price_per_night, calculateNights(booking.start_date, booking.end_date))}
                        </p>

                      </div>
                     {currentUser.is_admin && ( <div>
                        <p className="text-sm text-brown-450 mb-1">
                           </p>
                          <button
                          onClick={() => navigate(`/profile`)}
                          className="flex-1 bg-brown-350 hover:bg-brown-450 text-white font-medium py-2 px-4 rounded-md transition-colors"
                        >Huesped</button>  
                      </div>)}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => navigate(`/booking/${booking.hut_to.id}`)}
                          className="flex-1 bg-brown-350 hover:bg-brown-450 text-white font-medium py-2 px-4 rounded-md transition-colors"
                        >
                          Ver Reserva
                        </button>
                        <button
                          onClick={() => navigate(`/huts/${booking.hut_to.id}`)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
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
    </div>
  );
};

export default Bookings;