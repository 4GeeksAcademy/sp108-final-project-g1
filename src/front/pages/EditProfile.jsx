import { useState, useRef } from 'react'; // Añadido useRef
import { Link } from "react-router-dom";


export const EditProfile = () => {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "Nombre Actual",
    email: "email@actual.com",
    phone: "982364617",
    address: "Santa Xusta 3, 27665 - Cervantes (Lugo)",
    profileImage: "https://flowbite.com/docs/images/people/profile-picture-3.jpg"
  });

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // **Aquí iría la subida al servidor**
    // Ejemplo con FormData (simulado):
    const uploadData = new FormData(); // Cambiado el nombre para evitar conflicto
    uploadData.append('avatar', file);

    try {
      // Simulación de API (reemplaza con tu llamada real)
      // const response = await axios.post('/api/upload-avatar', uploadData);
      // const newImageUrl = response.data.url;

      // Para el ejemplo, usamos una URL temporal
      const newImageUrl = URL.createObjectURL(file);

      // Actualizar estado
      setFormData({
        ...formData,
        profileImage: newImageUrl
      });
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí iría la lógica para guardar los cambios
    console.log("Datos a guardar:", formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <form onSubmit={handleSubmit} className="rounded-3xl border-8 border-brown-250 w-full max-w-2xl bg-green-150 space-y-6 p-6">
        <h2 className="text-center text-4xl md:text-5xl font-bold text-green-350">Editar Perfil</h2>
        <div className="flex flex-col items-center">
          <img
            src={formData.profileImage} // Cambiado de profileData a formData
            alt="Foto de perfil"
            className="h-32 w-32 rounded-full border-4 border-white object-cover cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          />
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          <p className="text-white text-sm mt-2">Haz clic para cambiar la foto</p>
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Nombre</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 rounded-lg border bg-white/90" />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Email</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full p-3 rounded-lg border bg-white/90" />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Teléfono</label>
          <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full p-3 rounded-lg border bg-white/90" />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Dirección</label>
          <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full p-3 rounded-lg border bg-white/90" />
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
          <Link to="/profile" className="bg-gradient-to-br from-brown-250 to-green-250 text-center p-3 rounded-3xl border border-brown-250 hover:scale-[1.02] md:w-1/4 text-white">
            Cancelar
          </Link>
          <button type="submit" className="bg-gradient-to-br from-brown-550 to-green-450 p-3 rounded-3xl border border-brown-250 hover:scale-[1.02] md:w-1/4 text-white">
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};