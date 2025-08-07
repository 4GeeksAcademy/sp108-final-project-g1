import { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import { getCurrentUser } from '../services/users'
import useGlobalReducer from "../hooks/useGlobalReducer"

export const Profile = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")

  const { store, dispatch } = useGlobalReducer()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!store.currentUser) {
          const userId = localStorage.getItem('userId')
          if (!userId) return

          const user = await getCurrentUser(userId)
          dispatch({ type: "currentUser", payload: user })
          setEmail(user.email)
        } else {
          setEmail(store.currentUser.email)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
      }
    }
    fetchUserProfile()
  }, [])

  return (
    <div>
      {
        store.currentUser && (
          <div className="flex justify-center items-center min-h-screen p-4">
            <div className="rounded-3xl border-8 border-brown-250 w-full max-w-2xl bg-green-150 space-y-6 md:space-y-8 p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-profile rounded-3xl md:rounded-full border border-brown-550 p-4 md:p-0">
                <img
                  className="h-20 md:h-40 lg:h-40 w-20 md:w-40 lg:w-40 rounded-full border-4 border-white"
                  src={store.currentUser.profile_image || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"}
                  alt="Foto de perfil"
                />
                <div className="text-center sm:text-left">
                  <h2 className="font-bold text-xl md:text-2xl text-white">{store.currentUser.first_name || "No especificado"}</h2>
                  <span className="text-sm text-gray-200">{store.currentUser.email}</span>
                </div>
              </div>
              <div className="text-center bg-white/20 rounded-lg p-3">
                <p className="break-words"><span className="font-bold">Teléfono:</span> {store.currentUser.phone_number || "No especificado"}</p>
                <p className="break-words"><span className="font-bold">Dirección: </span> {store.currentUser.address || "No especificado"}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 text-xs md:text-sm">
                <Link to="/bookings" className="hover:underline hover:scale-[1.02] hover:text-green-350 px-2 py-1">
                  Ver mis reservas
                </Link>
                <Link to="/" className="hover:underline hover:scale-[1.02] hover:text-green-350 px-2 py-1">
                  Ver mis reseñas
                </Link>
                <button
                  onClick={() => setIsOpen(true)}
                  className="hover:underline hover:scale-[1.02] hover:text-green-350 px-2 py-1"
                >
                  Borrar mi cuenta
                </button>
              </div>
              {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                    <div className="flex flex-col sm:flex-row items-start gap-4 border-b p-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-alert-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg md:text-xl font-semibold">Estás por eliminar tu cuenta permanentemente</h3>
                          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 ml-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="mt-2 text-sm md:text-base">
                          <p>¿Confirmas que deseas continuar? Esta acción:</p>
                          <ul className="list-disc pl-5 mt-2">
                            <li>Borrará tu perfil y toda tu información</li>
                            <li>Eliminará tu historial</li>
                            <li>No podrá revertirse</li>
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
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 bg-gradient-to-br from-brown-550 to-green-450 rounded-3xl border border-brown-250 hover:scale-[1.02] text-white"
                      >
                        Aceptar
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex flex-col sm:flex-row justify-between gap-3">
                <Link
                  to="/"
                  className="bg-gradient-to-br from-brown-250 to-green-250 rounded-3xl border border-brown-250 text-center text-sm md:text-base md:w-1/4 p-2 hover:scale-[1.02] text-white"
                >
                  Atrás
                </Link>
                <Link
                  to="/edit-profile"
                  className="bg-gradient-to-br from-brown-550 to-green-450 rounded-3xl border border-brown-250 text-center text-sm md:text-base md:w-1/4 p-2 hover:scale-[1.02] text-white"
                >
                  Modificar
                </Link>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};
