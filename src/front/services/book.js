import { checkAuth } from '../tools/authTools';

let host = import.meta.env.VITE_BACKEND_URL;
const uri = `${host}api/bookings`;

export const getBookingsDetail = async () => {
    checkAuth();
    try {
        const response = await fetch(uri,
            {
                headers:
                {
                    'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
                }
            }
        )
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Sesión expirada');
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        if (!response.ok && response.status == 404) {
            console.log("NO ENCONTRÈ LA LISTA DE RESERVAS")
        };
        const data = await response.json();
console.log("Datos de la API:", data)
        return data.results
    } catch (error) {
        console.error("ERROR AL CARGAR RESERVAS", error);
        throw error; // ¡Importante! Si no relanzas el error, el componente nunca lo capturará.
    }
}
// localStorage.setItem("bookingsDetail", JSON.stringify(data.results));

// if (response.status === 401) {
//   throw new Error('Sesión expirada');
// }
// if (!response.ok) {
//   throw new Error('Error al obtener reservas');
// }