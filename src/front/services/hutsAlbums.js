// src/services/hutsAlbum.js
export const getHutAlbum = async (hutId) => {
  const host = import.meta.env.VITE_BACKEND_URL
  const response = await fetch(`${host}api/huts-album/${hutId}`)
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Error cargando álbum')
  return data
}

export const addHutAlbumUrls = async ({ hut_id, type, urls }) => {
  const host = import.meta.env.VITE_BACKEND_URL
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  const response = await fetch(`${host}api/huts-album`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ hut_id, type, urls })
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Error guardando fotos')
  return data
}