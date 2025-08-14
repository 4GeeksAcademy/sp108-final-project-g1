import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createHut } from '../services/hut'
import { addHutAlbumUrls } from '../services/hutsAlbums'
import useGlobalReducer from '../hooks/useGlobalReducer'

const HutForm = () => {
  const { store } = useGlobalReducer()
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [hutData, setHutData] = useState({
    name: '',
    description: '',
    capacity: 2,
    bedrooms: 1,
    bathroom: 1,
    price_per_night: 100,
    location_id: 1,
    image_url: '',
    is_active: true,
    location_coords: { lat: null, lng: null },
    image_file: null,
    image_preview: ''
  })

  const [albumUrls, setAlbumUrls] = useState({
    bedroom: '',
    bathroom: '',
    living_room: '',
    kitchen: '',
    other_picture: ''
  })

  const handleChange = (event) => {
    const { name, value, checked } = event.target
    setHutData(prev => ({
      ...prev,
      [name]: name === 'is_active' ? checked : value
    }))
  }

  const handleNumberChange = (event) => {
    const { name, value } = event.target
    setHutData(prev => ({
      ...prev,
      [name]: parseInt(value) || 0
    }))
  }

  const handleAlbumChange = (event) => {
    const { name, value } = event.target
    setAlbumUrls(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const created = await createHut(hutData)
      const createdHut = created.results || created.hut || created
      const hutId = createdHut?.id
      if (!hutId) throw new Error('No se pudo obtener el ID de la cabaña creada')

      const types = ['bedroom', 'bathroom', 'living_room', 'kitchen', 'other_picture']
      const tasks = []

      types.forEach((type) => {
        const single = (albumUrls[type] || '').trim()
        if (single) {
          tasks.push(addHutAlbumUrls({ hut_id: hutId, type, urls: [single] }))
        }
      })

      if (tasks.length) await Promise.all(tasks)

      navigate('/huts')
    } catch (error) {
      console.error('Error al crear cabaña:', error)
      setError(error.message || 'Error al crear la cabaña')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold text-green-550 mb-6">Crear Nueva Cabaña</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brown-550 mb-1">
                <span className="inline-flex items-baseline gap-1 whitespace-nowrap">Nombre <span className="text-red-500">*</span></span>
              </label>
              <input
                type="text"
                name="name"
                value={hutData.name}
                onChange={handleChange}
                className="w-full p-2 border border-brown-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-550 mb-1">
                <span className="inline-flex items-baseline gap-1 whitespace-nowrap">Descripción <span className="text-red-500">*</span></span>
              </label>
              <textarea
                name="description"
                value={hutData.description}
                onChange={handleChange}
                rows="4"
                className="w-full p-2 border border-brown-200 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-550 mb-1">
                <span className="inline-flex items-baseline gap-1 whitespace-nowrap">URL de la imagen <span className="text-red-500">*</span></span>
              </label>
              <input
                type="url"
                name="image_url"
                value={hutData.image_url}
                onChange={handleChange}
                className="w-full p-2 border border-brown-200 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-brown-550 mb-1">
                  <span className="inline-flex items-baseline gap-1 whitespace-nowrap">Capacidad <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="number"
                  name="capacity"
                  min="1"
                  value={hutData.capacity}
                  onChange={handleNumberChange}
                  className="w-full p-2 border border-brown-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-550 mb-1">
                  <span className="inline-flex items-baseline gap-1 whitespace-nowrap">Dormitorios <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  min="1"
                  value={hutData.bedrooms}
                  onChange={handleNumberChange}
                  className="w-full p-2 border border-brown-200 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brown-550 mb-1">
                  <span className="inline-flex items-baseline gap-1 whitespace-nowrap">Baños <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="number"
                  name="bathroom"
                  min="1"
                  value={hutData.bathroom}
                  onChange={handleNumberChange}
                  className="w-full p-2 border border-brown-200 rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-550 mb-1">
                <span className="inline-flex items-baseline gap-1 whitespace-nowrap">Precio por noche <span className="text-red-500">*</span></span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-brown-550">$</span>
                <input
                  type="number"
                  name="price_per_night"
                  min="1"
                  step="0.01"
                  value={hutData.price_per_night}
                  onChange={handleNumberChange}
                  className="w-full pl-8 p-2 border border-brown-200 rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-550 mb-1">
                <span className="inline-flex items-baseline gap-1 whitespace-nowrap">Ubicación (ID) <span className="text-red-500">*</span></span>
              </label>
              <input
                type="number"
                name="location_id"
                min="1"
                value={hutData.location_id}
                onChange={handleNumberChange}
                className="w-full p-2 border border-brown-200 rounded-lg"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={hutData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-green-550 focus:ring-green-550 border-brown-200 rounded"
              />
              <label className="ml-2 block text-sm text-brown-550">
                Cabaña activa (disponible para reservas)
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-brown-200 pt-6">
          <h3 className="text-lg font-semibold text-brown-650 mb-4">Álbum de fotos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-brown-550 mb-1">Dormitorio</label>
              <input
                type="url"
                name="bedroom"
                value={albumUrls.bedroom}
                onChange={handleAlbumChange}
                className="w-full p-2 border border-brown-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brown-550 mb-1">Baño</label>
              <input
                type="url"
                name="bathroom"
                value={albumUrls.bathroom}
                onChange={handleAlbumChange}
                className="w-full p-2 border border-brown-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brown-550 mb-1">Salón</label>
              <input
                type="url"
                name="living_room"
                value={albumUrls.living_room}
                onChange={handleAlbumChange}
                className="w-full p-2 border border-brown-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brown-550 mb-1">Cocina</label>
              <input
                type="url"
                name="kitchen"
                value={albumUrls.kitchen}
                onChange={handleAlbumChange}
                className="w-full p-2 border border-brown-200 rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brown-550 mb-1">Otras</label>
              <input
                type="url"
                name="other_picture"
                value={albumUrls.other_picture}
                onChange={handleAlbumChange}
                className="w-full p-2 border border-brown-200 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/huts')}
            className="px-4 py-2 border border-brown-300 rounded-lg text-brown-550 hover:bg-brown-50 w-full sm:w-auto"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-550 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando...
              </span>
            ) : 'Crear Cabaña'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default HutForm