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

export const getProfile = async () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  const response = await fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    throw new Error("Sesión expirada");
  }

  if (!response.ok) {
    throw new Error("Error al obtener el perfil del usuario");
  }

  return await response.json();
};

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
                // last_name: userData.last_name,
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