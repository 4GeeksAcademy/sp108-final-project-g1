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





export const createBooking = async (bookingData) => {
    checkAuth();
    try {
        const response = await fetch(uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
            },
            body: JSON.stringify(bookingData)
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Sesión expirada');
            }
            if (response.status === 409) {
                throw new Error('La cabaña ya está ocupada en esas fechas');
            }
            if (response.status === 400) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Datos de reserva inválidos');
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Error al crear reserva');
        }

        return data;


    } catch (error) {
        console.error("ERROR AL CREAR RESERVA", error);
        throw error; // Relanzamos el error para que el componente pueda manejarlo
    }
}