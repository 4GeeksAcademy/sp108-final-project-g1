import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer';
import { getUserById } from '../services/users';

export const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();
  const { store } = useGlobalReducer();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const user = await getUserById(userId);
        setUserData(user);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('No se pudo cargar la información del usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-550"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p>{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-2 px-4 py-2 bg-brown-350 text-white rounded-md"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {userData && (
        <div className="flex justify-center items-center min-h-screen p-4">
          <div className="rounded-3xl border-8 border-brown-250 w-full max-w-2xl bg-green-150 space-y-6 md:space-y-8 p-4 md:p-6">
            {/* Header con foto y nombre */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-profile rounded-3xl md:rounded-full border border-brown-550 p-4 md:p-0">
              <img
                className="h-20 md:h-40 lg:h-40 w-20 md:w-40 lg:w-40 rounded-full border-4 border-white"
                src={userData.profile_image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
                alt={`Foto de perfil de ${userData.first_name}`}
              />
              <div className="text-center sm:text-left">
                <h2 className="font-bold text-xl md:text-2xl text-white">{userData.first_name || "No especificado"}</h2>
                <span className="text-sm text-gray-200">{userData.email}</span>
                {store.currentUser?.is_admin && (
                  <p className="text-xs text-white mt-1">ID: {userData.id}</p>
                )}
              </div>
            </div>

            {/* Información del usuario */}
            <div className="text-center bg-white/20 rounded-lg p-3">
              <p className="break-words"><span className="font-bold">Teléfono:</span> {userData.phone_number || "No especificado"}</p>
              <p className="break-words"><span className="font-bold">Dirección:</span> {userData.address || "No especificado"}</p>
              <p className="break-words mt-2">
                <span className="font-bold">Estado:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${userData.is_active ? 'bg-green-500' : 'bg-red-500'}`}>
                  {userData.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </p>
            </div>

            {/* Botones de acción (solo para admin) */}
            {store.currentUser?.is_admin && (
              <div className="flex flex-wrap justify-center gap-3 text-xs md:text-sm">
                <Link 
                  to={`/bookings/${userData.id}`} 
                  className="hover:underline hover:scale-[1.02] hover:text-green-350 px-2 py-1"
                >
                  Ver reservas del huésped
                </Link>
                <button
                  onClick={() => setIsOpen(true)}
                  className="hover:underline hover:scale-[1.02] hover:text-green-350 px-2 py-1"
                >
                  {userData.is_active ? 'Desactivar cuenta' : 'Activar cuenta'}
                </button>
              </div>
            )}

            {/* Modal de confirmación (solo para admin) */}
            {isOpen && store.currentUser?.is_admin && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                  <div className="flex flex-col sm:flex-row items-start gap-4 border-b p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-alert-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg md:text-xl font-semibold">
                          {userData.is_active ? 'Desactivar cuenta' : 'Activar cuenta'}
                        </h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 ml-2">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-2 text-sm md:text-base">
                        <p>¿Confirmas que deseas {userData.is_active ? 'desactivar' : 'activar'} esta cuenta?</p>
                        <ul className="list-disc pl-5 mt-2">
                          <li>{userData.is_active ? 'El usuario no podrá iniciar sesión' : 'El usuario podrá acceder nuevamente'}</li>
                          <li>Las reservas existentes se mantendrán</li>
                          <li>Puedes revertir esta acción</li>
                        </ul>
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
                      onClick={() => {
                        // Aquí iría la lógica para cambiar el estado
                        setIsOpen(false);
                      }}
                      className="px-4 py-2 bg-gradient-to-br from-brown-550 to-green-450 rounded-3xl border border-brown-250 hover:scale-[1.02] text-white"
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Botones inferiores */}
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <button
                onClick={() => navigate(-1)}
                className="bg-gradient-to-br from-brown-250 to-green-250 rounded-3xl border border-brown-250 text-center text-sm md:text-base md:w-1/4 p-2 hover:scale-[1.02] text-white"
              >
                Atrás
              </button>
              

            </div>
          </div>
        </div>
      )}
    </div>
  );
};