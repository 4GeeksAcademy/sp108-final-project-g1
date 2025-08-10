import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getCurrentBooking } from "../services/book";
import { calculateNights, calculateTotalStayCost } from '../tools/utilFunctions';
import { Link } from "react-router-dom";

export const CurrentBooking = () => {
  const { id } = useParams();
  const { store, dispatch } = useGlobalReducer();
  const currentBooking = store.bookingsDetail[0];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentBooking = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentBooking(id);
        // Asegúrate de que data sea un objeto y no un array
        dispatch({ type: "currentBooking", payload: data });
      } catch (err) {
        console.error("Error cargando reserva:", err);
        if (err.message.includes('Sesión expirada')) {
          dispatch({ type: 'logout' });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white">Cargando detalles de la reserva...</p>
      </div>
    );
  }

  if (!currentBooking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white">No se encontró la reserva.</p>
      </div>
    );
  }

  // Acceso seguro a hut_to
  const hutName = currentBooking.hut_to?.name || 'Cabaña sin nombre'
  const hutLocation = currentBooking.hut_to?.location || 'Sin ubicación'

  return (
    <div className="current-booking bg-gray-900 min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="booking-bg border-4 border-green-150 rounded-2xl bg-gray-800 shadow-xl">
          {/* Encabezado */}
          <div className="bg-gradient-to-b from-green-550 to-green-250 rounded-tl-xl rounded-tr-xl px-5 py-4">
            <h2 className="text-2xl font-semibold text-white">
              Reserva #{currentBooking.id}
            </h2>
          </div>

          {/* Contenido SIN scroll */}
          <div className="px-5 py-4 space-y-3">
            <ul className="text-white space-y-4 text-sm sm:text-base">
              <li className="flex justify-between pb-2 border-b border-gray-700">
                <span className="font-semibold text-gray-300">Cabaña:</span>
                <span className="text-right">
                  <span className="block font-medium">{hutName}</span>
                  <span className="flex flex-col">
                    <span className="text-gray-400 text-xs">{currentBooking.hut_to.location_to.complex}</span>
                    <span className="text-gray-400 text-xs">{currentBooking.hut_to.location_to.address}</span>
                    <span className="text-gray-400 text-xs">{currentBooking.hut_to.location_to.city}</span>
                  </span>
                </span>
              </li>

              <li className="flex justify-between pb-2 border-b border-gray-700">
                <span className="font-semibold text-gray-300">Fecha de entrada:</span>
                <span>{new Date(currentBooking.start_date).toLocaleDateString()}</span>
              </li>

              <li className="flex justify-between pb-2 border-b border-gray-700">
                <span className="font-semibold text-gray-300">Fecha de salida:</span>
                <span>{new Date(currentBooking.end_date).toLocaleDateString()}</span>
              </li>

              <li className="flex justify-between pb-2 border-b border-gray-700">
                <span className="font-semibold text-gray-300">Huéspedes:</span>
                <span>{currentBooking.guests}</span>
              </li>

              <li className="flex justify-between pb-2 border-b border-gray-700">
                <span className="font-semibold text-gray-300">Importe total:</span>
                <span className="font-bold">{calculateTotalStayCost(currentBooking.hut_to.price_per_night, calculateNights(currentBooking.start_date, currentBooking.end_date))} €</span>
              </li>

              <li className="flex justify-between pb-2 border-b border-gray-700">
                <span className="font-semibold text-gray-300">Solicitudes especiales:</span>
                <span>{currentBooking.special_requests || 'Ninguna'}</span>
              </li>

              <li className="flex justify-between pb-2 border-b border-gray-700">
                <span className="font-semibold text-gray-300">Estado de la reserva:</span>
                <span>{currentBooking.status_reserved === 'active' ? '✅ Confirmado' : '⚠ Pendiente'}</span>
              </li>

              <li className="flex justify-between pb-2">
                <span className="font-semibold text-gray-300">Estado del pago:</span>
                <span>{currentBooking.status_payment ? '✅ Confirmado' : '⚠ Pendiente'}</span>
              </li>
            </ul>
          </div>

          {/* Footer opcional */}
          <div className="flex justify-center px-5 py-3 bg-gradient-to-t from-green-550 to-green-250 rounded-bl-xl rounded-br-xl">
            <Link to="/bookings">
                <button className="bg-gradient-to-br from-brown-250 to-green-250 rounded-3xl border border-brown-250 text-center text-sm md:text-base p-2 hover:scale-[1.02] text-white">
                  Volver a "Mis Reservas"
                </button>
            </Link>
            
          </div>
        </div>
      </div>
    </div>
  );
};