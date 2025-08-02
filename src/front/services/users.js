const host = import.meta.env.VITE_BACKEND_URL

export const getUsers = async () => {
    try {
        const response = await fetch(`${host}api/users/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (!response.ok) {
            throw new Error(`Error ${response.status}: Los datos de los usuarios no se han cargado correctamente`)
        }
        const data = await response.json()
        return data.results
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message)
        throw Error
    }
}

export const getCurrentUser = async (id) => {
    if (!userId) {
        throw new Error('Se requiere un ID de usuario');
    }
    try {
        const response = await fetch(`${host}api/users/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (!response.ok) {
            throw new Error(`Error ${response.status}: Los datos del usuario ${id} no se han cargado correctamente`)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error(`Error al obtener usuario ${id}:`, error.message)
        throw Error
    }
}

export const putCurrentUser = async (id, userData) => {
    if (!id) throw new Error('Se requiere ID de usuario');
    try {
        const response = await fetch(`${host}api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                first_name: userData.first_name,
                last_name: userData.last_name,
                phone_number: userData.phone_number,
                address: userData.address,
                profile_image: userData.profile_image
            })
        });
        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Error al actualizar perfil')
        }
        return await response.json()
    } catch (error) {
        console.error('Error actualizando usuario:', error.message)
        throw error
    }
}

// export const desactivateCurrentUser = async (id) => {
//     if (!id) throw new Error("ID de usuario no proporcionado");
//     try {
//         const response = await fetch(`${host}api/users/${id}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${localStorage.getItem('token')}`
//             },
//             body: JSON.stringify({
//                 is_active: false,
//             })
//         });
//         const data = await response.json()
//         if (!response.ok) {
//             throw new Error(data.message);
//         }
//         localStorage.removeItem("token");
//         return true;
//     } catch (error) {
//         console.error("Error al eliminar el usuario:", error.message);
//         return false;
//     }
// };