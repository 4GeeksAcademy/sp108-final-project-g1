import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSigleHuts } from '../services/singleHut';
import useGlobalReducer from '../hooks/useGlobalReducer';

import { createBooking } from '../services/book';


export const SingleHut = () => {
    const { id } = useParams();
    const [hut, setHut] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { store, dispatch } = useGlobalReducer();
    const [showReserveModal, setShowReserveModal] = useState(false);
    const [bookingData, setBookingData] = useState({
        start_date: '',
        end_date: '',
        guests: 1,
        special_requests: ''
    });
    const [bookingError, setBookingError] = useState(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);


    useEffect(() => {
        const fetchHutData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Primero verifica si la cabaña ya está en el store
                const hutFromStore = store.hutsDetail.find(h => h.id === parseInt(id));

                if (hutFromStore) {
                    setHut(hutFromStore);
                    setLoading(false);
                    return;
                }

 
                const hutData = await getSigleHuts(id);

                if (!hutData) {
                    throw new Error('No se recibieron datos de la cabaña');
                }

      
                dispatch({
                    type: 'hutsDetail',
                    payload: [...store.hutsDetail, hutData]
                });

                setHut(hutData);
            } catch (err) {
                console.error("Error fetching hut:", err);
                setError({
                    message: 'No se pudo cargar la información de la cabaña',
                    details: err.message
                });
            } finally {
                setLoading(false);
            }
        };

        fetchHutData();
    }, [id, store.hutsDetail, dispatch]);

    const handleReserveClick = () => {
        setShowReserveModal(true);
        setBookingData({
            start_date: '',
            end_date: '',
            guests: 1,
            special_requests: ''
        });
        setBookingError(null);
        setBookingSuccess(false);
    };

     const handleCloseReserveModal = () => {
        setShowReserveModal(false);
        setBookingSuccess(false);
    };

    const handleBookingChange = (e) => {
        const { name, value } = e.target;
        setBookingData(prev => ({
            ...prev,
            [name]: name === 'guests' ? parseInt(value) : value
        }));
    };

         const handleBookingSubmit = async (e) => {
           e.preventDefault();
           setBookingError(null);
           
           if (!bookingData.start_date || !bookingData.end_date) {
             setBookingError('Debes seleccionar fechas de inicio y fin');
             return;
           }
       
           try {
             const bookingPayload = {
               hut_id: hut.id,
               start_date: bookingData.start_date,
               end_date: bookingData.end_date,
               guests: bookingData.guests,
               special_requests: bookingData.special_requests
             };
       
             const response = await createBooking(bookingPayload);
             
             if (response.success) {
               setBookingSuccess(true);
               dispatch({ type: "bookingsDetail", payload: bookingPayload })
               setBookingError(null);
       
               
             } else {
               throw new Error(response.message || 'Error al realizar la reserva');
             }
           } catch (err) {
             console.error("Booking error:", err);
             setBookingError(err.message || 'Error al procesar la reserva');
           }
         };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <h3 className="font-bold">Error</h3>
                    <p>{error.message}</p>
                    {error.details && (
                        <p className="text-sm mt-2">{error.details}</p>
                    )}
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    if (!hut) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
                    <p>No se encontró la cabaña solicitada</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-6">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-brown-150">
    
                <div className="h-48 w-full md:w-auto md:max-w-full md:h-auto md:aspect-video overflow-hidden relative">
                    <img
                        src={hut.image_url}
                        alt={hut.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 z-10">

                    </div>
                </div>

                {/* Contenido */}
                <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-green-550">{hut.name}</h1>
                            <p className="text-green-450 text-sm md:text-base">
                                {hut.location_to?.city}, {hut.location_to?.region}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-lg md:text-xl font-semibold text-brown-550">
                                ${hut.price_per_night}
                            </span>
                            <span className="text-brown-350 text-sm md:text-base"> / noche</span>
                        </div>
                    </div>

              
                    <div className="mt-4 md:mt-6 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                        <div className="bg-green-150 p-2 md:p-3 rounded-lg text-center border border-green-250">
                            <p className="text-green-550 text-xs md:text-sm font-medium">HUÉSPEDES</p>
                            <p className="text-brown-550 font-bold md:font-medium">{hut.capacity}</p>
                        </div>
                        <div className="bg-green-150 p-2 md:p-3 rounded-lg text-center border border-green-250">
                            <p className="text-green-550 text-xs md:text-sm font-medium">DORMITORIOS</p>
                            <p className="text-brown-550 font-bold md:font-medium">{hut.bedrooms}</p>
                        </div>
                        <div className="bg-green-150 p-2 md:p-3 rounded-lg text-center border border-green-250">
                            <p className="text-green-550 text-xs md:text-sm font-medium">BAÑOS</p>
                            <p className="text-brown-550 font-bold md:font-medium">{hut.bathroom}</p>
                        </div>
                        <div className="absolute top-4 right-4 z-10">
         
                        </div>
                    </div>

                           <div className="mt-6">
                <button
                    onClick={handleReserveClick}
                    className="w-full py-3 bg-green-350 text-white font-medium rounded-lg hover:bg-green-450 transition-colors"
                >
                    Reservar ahora
                </button>
            </div>
                        {showReserveModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
                        <div className="flex justify-between items-center p-5 bg-green-100 border-b">
                            <h3 className="text-xl font-bold text-green-550">
                                Reservar {hut.name}
                            </h3>
                            <button
                                onClick={handleCloseReserveModal}
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
                                        Tu reserva en {hut.name} ha sido confirmada.
                                    </p>
                                    <button
                                        onClick={handleCloseReserveModal}
                                        className="mt-6 w-full py-3 bg-green-350 text-white font-medium rounded-lg hover:bg-green-450 transition-colors"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleBookingSubmit}>
                                    <div className="space-y-4 mb-6">
                                        {/* Formulario de reserva (igual que en Huts.jsx) */}
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
                                                    className="w-full p-2 border border-brown-200 rounded-lg"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-brown-550 mb-1">
                                                Huéspedes (máx. {hut.capacity})
                                            </label>
                                            <input
                                                type="number"
                                                name="guests"
                                                min="1"
                                                max={hut.capacity}
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
                            )}
                        </div>
                    </div>
                </div>
            )}


       
                    <div className="mt-4 md:mt-6">
                        <h2 className="text-lg md:text-xl font-semibold text-green-550 border-b border-green-250 pb-1">
                            Descripción
                        </h2>
                        <p className="mt-2 text-brown-450 text-sm md:text-base whitespace-pre-line">
                            {hut.description}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

}