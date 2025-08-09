const host = import.meta.env.VITE_BACKEND_URL


export const getReviews = async (hutId) => {
  const response = await fetch(`${host}api/reviews/hut/${hutId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })

  if (!response.ok) {
    throw new Error("No se pudieron cargar las reseñas");
  }

  return await response.json()
}

export const postReview = async (hut_id, reviewData) => {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("No hay sesión")

  const response = await fetch(`${host}api/reviews/${hut_id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(reviewData)
  })

  if (!response.ok) {
    throw new Error("Error al enviar la reseña")
  }
  return await response.json()
};
