const host = import.meta.env.VITE_BACKEND_URL

export const getAllReviews = async () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  const response = await fetch(`${host}api/reviews`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error('No se pudieron cargar las reseñas')
  }
  return data.results || data
}

export const postReview = async (hutId, formData) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  return fetch(`${host}api/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      hut_id: hutId,
      ...formData
    })
  })
}

export const getRandomReview = async () => {
  try {
    const response = await fetch(`${host}/api/reviews`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Error al obtener reseñas")
    }

    if (Array.isArray(data.results) && data.results.length > 0) {
      return data.results[Math.floor(Math.random() * data.results.length)]
    }
    return null
  } catch (err) {
    console.error('Error fetching reviews', err)
    throw err
  }
}

export const getUserReviews = async (userId) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token")
  if (!token) throw new Error("No hay sesión activa")
  const response = await fetch(`${host}api/reviews/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || "No se pudieron cargar las reseñas")
  return data.results
}