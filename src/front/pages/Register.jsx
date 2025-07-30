import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Eliminamos useNavigate ya que el modal maneja la redirección
import useGlobalReducer from "../hooks/useGlobalReducer";
import { register } from "../services/auth";

const Register = ({ onSuccess, hutName }) => {  // <- Props nuevas para el modal
  const { dispatch } = useGlobalReducer();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.password_confirmation) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      setError('Debes aceptar los términos y condiciones');
      setLoading(false);
      return;
    }

    try {
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      };

      const result = await register(dataToSend);

      localStorage.setItem('token', result.access_token);
      dispatch({ type: 'token', payload: result.access_token });
      dispatch({ type: 'isLogged', payload: true });
      dispatch({ type: 'currentUser', payload: result.user });

      if (onSuccess) onSuccess(); // <- Notifica al modal que el registro fue exitoso

    } catch (err) {
      setError(err.message || 'Error al registrar la cuenta');
      dispatch({
        type: 'handle_alert',
        payload: {
          text: 'Error al registrar',
          background: 'danger',
          visible: true
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      agreeTerms: false
    });
    dispatch({
      type: 'handle_alert',
      payload: {
        text: 'Formulario cancelado',
        background: 'warning',
        visible: true
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Mensaje contextual para reservas */}
      {hutName && (
        <p className="text-center text-brown-550 font-medium mb-4">
          Regístrate para reservar: <span className="text-green-550">{hutName}</span>
        </p>
      )}

      {/* Video de fondo (opcional, si prefieres mantenerlo en el modal) */}
      <div className="relative h-40 mb-6 rounded-lg overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://res.cloudinary.com/dmtvki1tj/video/upload/v1753689318/1104240_1080p_Laugh_1280x720_hizoyi.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre completo
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            Mínimo 8 caracteres con letras y números
          </p>
        </div>

        <div>
          <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
            Confirmar contraseña
          </label>
          <input
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            required
            value={formData.password_confirmation}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center">
          <input
            id="agreeTerms"
            name="agreeTerms"
            type="checkbox"
            required
            checked={formData.agreeTerms}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-900">
            Acepto los{' '}
            <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
              términos y condiciones
            </Link>
          </label>
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 mr-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 ml-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
        </div>
      </form>

      <div className="mt-4 text-center text-sm text-brown-150">
        ¿Ya tienes una cuenta?{' '}
        <Link to="/login" className="font-medium text-green-150 hover:text-green-350">
          Inicia sesión
        </Link>
      </div>
    </div>
  );
};

export default Register;