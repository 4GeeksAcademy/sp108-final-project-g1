let host = import.meta.env.VITE_BACKEND_URL;
const uri = `${host}api/huts`;
import { checkAuth } from '../tools/authTools';


export const getHutsDetail= async() =>{

    try {
        const response = await fetch(uri);
        const data = await response.json();
        console.log(data)

    return data.results

      } catch (error) {
        console.error("Error fetching huts:", error);
      }
    };
 

export const createHut = async (hutData) => {
    checkAuth();
    try {
        const response = await fetch(uri, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
            },
            body: JSON.stringify(hutData)
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Necesita permiso de administrador');
            }
            if (response.status === 400) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Faltan campos requeridos');
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Cabaña creada:", data);
        return data.results;

    } catch (error) {
        console.error("ERROR AL CREAR CABANA", error);
        throw error;
    }
}

export const updateHut = async (id, hutData) => {
    checkAuth();
    try {
        const response = await fetch(uri`/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
            },
            body: JSON.stringify(hutData)
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Se necesita permiso de administrador');
            }
            if (response.status === 404) {
                throw new Error('Cabaña no encontrada');
            }
            if (response.status === 409) {
                throw new Error('El nombre ya existe');
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Cabaña actualizada:", data);
        return data.results;

    } catch (error) {
        console.error("ERROR AL ACTUALIZAR CABANA", error);
        throw error;
    }
}


export const deleteHut = async (id) => {
    checkAuth();
    try {
        const response = await fetch(uri`/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error('Se requiere permiso de administrador');
            }
            if (response.status === 404) {
                const errorData = await response.json();
                throw new Error(errorData.message || `La cabaña con ID ${id} no existe`);
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Cabaña eliminada:", data);
        return data.message;

    } catch (error) {
        console.error("ERROR AL ELIMINAR CABANA", error);
        throw error;
    }
}