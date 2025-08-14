import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getSigleHuts } from '../services/singleHut'
import useGlobalReducer from '../hooks/useGlobalReducer'
import { createBooking } from '../services/book'
import { getHutAlbum, addHutAlbumUrls } from '../services/hutsAlbums'

export const SingleHut = () => {
  const { id } = useParams()
  const [hut, setHut] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { store } = useGlobalReducer()
  const isAuthenticated = !!store.token
  const [showReserveModal, setShowReserveModal] = useState(false)
  const [bookingData, setBookingData] = useState({
    start_date: '',
    end_date: '',
    guests: 1,
    special_requests: ''
  })
  const [bookingError, setBookingError] = useState(null)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [album, setAlbum] = useState([])
  const [albumLoading, setAlbumLoading] = useState(false)
  const [newUrls, setNewUrls] = useState('')
  const [photoType, setPhotoType] = useState('other_picture')
  const [savingAlbum, setSavingAlbum] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [activeImage, setActiveImage] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchHutData = async () => {
      try {
        const hutFromStore = store.hutsDetail.find((h) => h.id === parseInt(id))
        if (hutFromStore) {
          setHut(hutFromStore)
        } else {
          const hutData = await getSigleHuts(id)
          setHut(hutData)
        }
      } catch (error) {
        setError({
          message: 'No se pudo cargar la información',
          details: error.message
        })
      } finally {
        setLoading(false)
      }
    }
    fetchHutData()
  }, [id, store.hutsDetail])

  useEffect(() => {
    const loadAlbum = async () => {
      if (!hut?.id) return
      try {
        setAlbumLoading(true)
        const data = await getHutAlbum(hut.id)
        setAlbum(data.results || [])
      } catch (error) {
        console.error(error)
      } finally {
        setAlbumLoading(false)
      }
    }
    loadAlbum()
  }, [hut?.id])

  const handleReserveClick = () => {
    setShowReserveModal(true)
    setBookingData({
      start_date: '',
      end_date: '',
      guests: 1,
      special_requests: ''
    })
    setBookingError(null)
    setBookingSuccess(false)
  }

  const handleCloseReserveModal = () => {
    setShowReserveModal(false)
    setBookingSuccess(false)
  }

  const handleBookingChange = (event) => {
    const { name, value } = event.target
    setBookingData((prev) => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) : value
    }))
  }

  const handleBookingSubmit = async (event) => {
    event.preventDefault()
    setBookingError(null)
    if (!bookingData.start_date || !bookingData.end_date) {
      setBookingError('Debes seleccionar fechas de inicio y fin')
      return
    }
    try {
      const bookingPayload = {
        hut_id: hut.id,
        start_date: bookingData.start_date,
        end_date: bookingData.end_date,
        guests: bookingData.guests,
        special_requests: bookingData.special_requests
      }
      const response = await createBooking(bookingPayload)
      if (response.success) {
        setBookingSuccess(true)
      } else {
        throw new Error(response.message || 'Error al realizar la reserva')
      }
    } catch (error) {
      setBookingError(error.message || 'Error al procesar la reserva')
    }
  }

  const handleAddAlbum = async (event) => {
    event.preventDefault()
    if (!store.currentUser?.is_admin) return
    const urls = newUrls.split('\n').map((u) => u.trim()).filter(Boolean)
    if (!urls.length) return
    try {
      setSavingAlbum(true)
      const response = await addHutAlbumUrls({
        hut_id: hut.id,
        type: photoType,
        urls
      })
      const saved = response.results || []
      setAlbum((prev) => [...saved, ...prev])
      setNewUrls('')
      setPhotoType('other_picture')
    } catch (error) {
      alert(error.message || 'No se pudieron guardar las fotos')
    } finally {
      setSavingAlbum(false)
    }
  }

  const openImageModal = (url) => {
    setActiveImage(url)
    setShowImageModal(true)
  }

  const closeImageModal = () => {
    setShowImageModal(false)
    setActiveImage(null)
  }

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-550"></div></div>
  if (error) return <div className="p-6 text-center text-red-500">{error.message}</div>
  if (!hut) return <div className="p-6 text-center text-yellow-500">No se encontró la cabaña solicitada</div>

  return (
    <div className="body w-full min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="bg-white rounded-2xl border-4 border-green-250 shadow-xl flex flex-col lg:flex-row overflow-hidden max-w-6xl w-full h-auto lg:h-[90vh]">
        <div className="lg:w-1/2 flex-shrink-0">
          <img src={hut.image_url} alt={hut.name} className="w-full h-56 lg:h-[420px] object-cover" />
          {album.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2">
              {album.map((photo) => (
                <img
                  key={photo.id}
                  src={photo.image_url}
                  alt={photo.type}
                  className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-90"
                  onClick={() => openImageModal(photo.image_url)}
                />
              ))}
            </div>
          )}
          {albumLoading && (
            <div className="p-2 text-sm text-gray-500">Cargando álbum...</div>
          )}
        </div>

        <div className="lg:w-1/2 flex flex-col p-6 overflow-y-auto min-h-0 min-w-0">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-green-350">{hut.name}</h1>
              <p className="text-sm sm:text-lg text-green-350">{hut.location_to?.city}, {hut.location_to?.region}</p>
            </div>
            <div className="text-right">
              <p className="text-xl sm:text-2xl font-bold">${hut.price_per_night}</p>
              <span className="text-sm">/noche</span>
            </div>
          </div>

          <div className="mb-6 overflow-y-auto max-h-64 lg:min-h-[50vh] lg:max-h-[50vh]">
            <h2 className="text-xl font-semibold border-b border-green-200 pb-2">Descripción</h2>
            <p className="mt-3 text-base leading-relaxed break-words">{hut.description}</p>
          </div>

          {store.currentUser?.is_admin && (
            <div className="mb-6 border-t border-green-200 pt-4">
              <h3 className="text-lg font-semibold mb-3">Añadir fotos al álbum</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  className="p-2 border rounded"
                  value={photoType}
                  onChange={(event) => setPhotoType(event.target.value)}
                >
                  <option value="bedroom">Dormitorio</option>
                  <option value="bathroom">Baño</option>
                  <option value="living_room">Salón</option>
                  <option value="kitchen">Cocina</option>
                  <option value="other_picture">Otra</option>
                </select>
                <div className="sm:col-span-2">
                  <input
                    className="w-full p-2 border rounded"
                    placeholder="URL..."
                    value={newUrls}
                    onChange={(event) => setNewUrls(event.target.value)}
                  />
                </div>
              </div>
              <button
                onClick={handleAddAlbum}
                disabled={savingAlbum}
                className={`mt-3 w-full sm:w-auto px-4 py-2 rounded text-white ${savingAlbum ? 'bg-green-300' : 'bg-green-450 hover:scale-[1.02]'}`}
              >
                {savingAlbum ? 'Guardando...' : 'Añadir fotos'}
              </button>
            </div>
          )}

          <div className='flex flex-col gap-4 items-center'>
            {!store.currentUser.is_admin && (
              <button onClick={handleReserveClick} className="w-full py-3 bg-gradient-to-br from-brown-550 to-green-450 p-3 rounded-3xl hover:scale-[1.02] text-white font-bold rounded-lg transition-transform text-lg">Reservar ahora</button>
            )}
            <button onClick={() => navigate(-1)} className="bg-gradient-to-br from-brown-250 to-green-250 rounded-3xl border border-brown-250 text-center text-sm md:text-base md:w-1/2 p-2 hover:scale-[1.02] text-white">← Volver atrás</button>
          </div>
        </div>
      </div>

      {showReserveModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-30 p-4">
          <div className="bg-white rounded-xl w-full max-w-md h-[80vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-5 bg-green-100 border-b">
              <h3 className="text-xl font-bold text-green-550">Reservar {hut.name}</h3>
              <button onClick={handleCloseReserveModal} className="text-brown-550 hover:text-brown-350 text-2xl">&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {bookingSuccess ? (
                <div className="text-center">
                  <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <h3 className="text-lg font-medium text-green-550 mt-4">¡Reserva confirmada!</h3>
                  <p className="mt-2 text-brown-450">Tu reserva en {hut.name} ha sido confirmada.</p>
                  <button onClick={handleCloseReserveModal} className="mt-6 w-full py-3 bg-green-350 text-white font-medium rounded-lg hover:bg-green-450 transition-colors">Cerrar</button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit}>
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brown-550 mb-1">Fecha de llegada</label>
                        <input type="date" name="start_date" value={bookingData.start_date} onChange={handleBookingChange} className="w-full p-2 border border-brown-200 rounded-lg" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brown-550 mb-1">Fecha de salida</label>
                        <input type="date" name="end_date" value={bookingData.end_date} onChange={handleBookingChange} className="w-full p-2 border border-brown-200 rounded-lg" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brown-550 mb-1">Huéspedes (máx. {hut.capacity})</label>
                      <input type="number" name="guests" min="1" max={hut.capacity} value={bookingData.guests} onChange={handleBookingChange} className="w-full p-2 border border-brown-200 rounded-lg" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-brown-550 mb-1">Solicitudes especiales</label>
                      <textarea name="special_requests" value={bookingData.special_requests} onChange={handleBookingChange} rows="3" className="w-full p-2 border border-brown-200 rounded-lg"></textarea>
                    </div>
                  </div>
                  {bookingError && <div className="mb-4 p-3 bg-red-100 text-red-600 rounded text-sm">{bookingError}</div>}
                  <button type="submit" className="w-full py-3 bg-green-350 text-white font-medium rounded-lg hover:bg-green-450 transition-colors">Confirmar Reserva</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {showImageModal && activeImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-40 p-4" onClick={closeImageModal}>
          <div className="bg-white rounded-xl w-full max-w-3xl h-[80vh] overflow-hidden shadow-2xl flex flex-col" onClick={(event) => event.stopPropagation()}>
            <div className="flex justify-end p-2">
              <button onClick={closeImageModal} className="text-brown-550 hover:text-brown-350 text-2xl">&times;</button>
            </div>
            <div className="flex-1 overflow-hidden px-4 pb-4">
              <img src={activeImage} alt="Foto" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
