// src/components/EditProfile.jsx
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useGlobalReducer from '../hooks/useGlobalReducer'
import { toast } from 'react-toastify'
import { updateUser, uploadAvatar } from '../services/profile'

export const EditProfile = () => {
  const { store, dispatch } = useGlobalReducer()
  const fileInputRef = useRef(null)
  const navigate = useNavigate()
  const [imagePreview, setImagePreview] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [pendingAvatarFile, setPendingAvatarFile] = useState(null)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    profile_image: ''
  })

  useEffect(() => {
    if (store.currentUser) {
      setFormData({
        first_name: store.currentUser.first_name || '',
        last_name: store.currentUser.last_name || '',
        email: store.currentUser.email || '',
        phone_number: store.currentUser.phone_number || '',
        address: store.currentUser.address || '',
        profile_image: store.currentUser.profile_image || ''
      })
      setImagePreview(store.currentUser.profile_image || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png')
    }
    console.log('currentUser cambió:', store.currentUser)
  }, [store.currentUser])

  const handleImageUpload = async event => {
    const file = event.target.files[0]
    if (!file) return
    if (!file.type.match('image.*')) {
      toast.warning('Por favor, selecciona un archivo de imagen', {
        position: 'top-center',
        autoClose: 3000,
        theme: 'colored'
      })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.warning('La imagen es demasiado grande (máximo 5MB)', {
        position: 'top-center',
        autoClose: 3000,
        theme: 'colored'
      })
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
    setPendingAvatarFile(file)
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setIsUploading(true)
    try {
      let payload = { ...formData }
      if (pendingAvatarFile) {
        const data = await uploadAvatar(store.currentUser.id, pendingAvatarFile)
        payload.profile_image = data.url || payload.profile_image
      }
      const updated = await updateUser(store.currentUser.id, payload)
      const updatedUser = updated.results || updated.user || updated
      dispatch({ type: 'currentUser', payload: updatedUser })
      console.log(updatedUser)
      const storage = localStorage.getItem('token') ? localStorage : sessionStorage
      storage.setItem('currentUser', JSON.stringify(updatedUser))
      toast.success('¡Perfil actualizado correctamente!', {
        position: 'top-center',
        autoClose: 3000,
        theme: 'colored'
      })
      navigate(`/profile/${updatedUser.id}`)
    } catch (error) {
      console.error('Error al guardar:', error)
      alert(error.message || 'Error al actualizar el perfil')
    } finally {
      setIsUploading(false)
      setPendingAvatarFile(null)
    }
  }

  const handleReturnProfile = () => {
    navigate(-1)
  }

  return (
    <div className='flex justify-center items-center min-h-screen p-4'>
      <form onSubmit={handleSubmit} className='rounded-3xl border-8 border-brown-250 w-full max-w-2xl bg-green-150 space-y-6 p-6'>
        <h2 className='text-center text-4xl md:text-5xl font-bold text-green-350'>Editar Perfil</h2>
        <div className='flex flex-col items-center'>
          <div className='relative'>
            <img
              src={imagePreview}
              alt='Foto de perfil'
              className='h-32 w-32 rounded-full border-4 border-white object-cover cursor-pointer hover:opacity-90 transition-opacity'
              onClick={() => fileInputRef.current?.click()}
            />
            {isUploading && (
              <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full'>
                <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white'></div>
              </div>
            )}
          </div>
          <input
            type='file'
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept='image/*'
            className='hidden'
          />
          <p className='text-white text-sm mt-2'>
            {isUploading ? 'Subiendo imagen...' : 'Haz clic para cambiar la foto'}
          </p>
        </div>
        <div className='mb-4'>
          <label className='block text-white mb-2'>Nombre</label>
          <input
            type='text'
            value={formData.first_name}
            onChange={e => setFormData({ ...formData, first_name: e.target.value })}
            className='w-full p-3 rounded-lg border bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-350'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-white mb-2'>Apellidos</label>
          <input
            type='text'
            value={formData.last_name}
            onChange={e => setFormData({ ...formData, last_name: e.target.value })}
            className='w-full p-3 rounded-lg border bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-350'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-white mb-2'>Email</label>
          <input
            type='email'
            value={formData.email}
            className='w-full p-3 rounded-lg border bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-350 disabled:opacity-50'
            required
            disabled
          />
        </div>
        <div className='mb-4'>
          <label className='block text-white mb-2'>Teléfono</label>
          <input
            type='tel'
            value={formData.phone_number}
            onChange={e => setFormData({ ...formData, phone_number: e.target.value })}
            className='w-full p-3 rounded-lg border bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-350'
          />
        </div>
        <div className='mb-4'>
          <label className='block text-white mb-2'>Dirección</label>
          <input
            type='text'
            value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
            className='w-full p-3 rounded-lg border bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-350'
          />
        </div>
        <div className='flex flex-col sm:flex-row justify-between gap-4 mt-8'>
          <button
            onClick={handleReturnProfile}
            type='button'
            className='bg-gradient-to-br from-brown-250 to-green-250 text-center p-3 rounded-3xl border border-brown-250 hover:scale-[1.02] transition-transform md:w-1/4 text-white'
          >
            Cancelar
          </button>
          <button
            type='submit'
            disabled={isUploading}
            className={`bg-gradient-to-br from-brown-550 to-green-450 p-3 rounded-3xl border border-brown-250 hover:scale-[1.02] transition-transform md:w-1/4 text-white ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUploading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}