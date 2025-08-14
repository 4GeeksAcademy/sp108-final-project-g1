export const updateUser = async (userId, formData) => {
    const host = import.meta.env.VITE_BACKEND_URL
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    const response = await fetch(`${host}api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
    })
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error al editar el perfil')
    }
    return await response.json()
}

export const uploadAvatar = async (userId, file) => {
  const host = import.meta.env.VITE_BACKEND_URL
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')

  const uploadData = new FormData()
  uploadData.append('avatar', file)
  uploadData.append('userId', userId)

  const response = await fetch(`${host}api/users/upload-avatar`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: uploadData
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Error al subir imagen')
  }
  return await response.json()
}