import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useGlobalReducer from "../hooks/useGlobalReducer";
import { register } from "../services/auth";

const Register = ({ onSuccess, hutName }) => {
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

  const navigate = useNavigate();

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

      // Guardar token y redirigir
      const storage = formData.rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', result.access_token);
      storage.setItem('currentUser', JSON.stringify(result.results))
      // Actualizar estado global
      dispatch({ type: 'token', payload: result.access_token });
      dispatch({ type: 'isLogged', payload: true });
      dispatch({ type: 'currentUser', payload: result.results });

      if (onSuccess) onSuccess();

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
    <div className="relative min-h-screen bg-brown-250 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://res.cloudinary.com/dmtvki1tj/video/upload/v1753689318/1104240_1080p_Laugh_1280x720_hizoyi.mp4" type="video/mp4" />

        </video>
        {/* Capa semitransparente para mejorar legibilidad */}
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      </div>

      {/* Contenido del login (encima del video) */}
      <div className="relative z-10 px-4 py-12 wood-bg border-8 border-green-150 sm:mx-auto sm:w-full sm:max-w-md rounded-lg shadow-xl">

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-green-250">
            Crear una cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-brown-350">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-medium text-green-150 hover:text-green-250">
              Inicia sesión
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-opacity-50 bg-green-150 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo electrónico
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
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
                  className={`flex-1 mr-2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                >
                  {loading ? 'Registrando...' : 'Registrarse'}
                </button>

                <Link to="/login"
                  type="button"
                  onClick={handleReset}
                  className="flex-1 ml-2 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancelar
                </Link>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    O regístrate con
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div>
                  <a
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Registrarse con Google</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.784-1.664-4.155-2.675-6.735-2.675-5.522 0-10 4.477-10 10s4.478 10 10 10c8.396 0 10-7.524 10-10 0-0.67-0.069-1.325-0.189-1.961h-9.811z" />
                    </svg>
                  </a>
                </div>

                <div>
                  <a
                    href="#"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Registrarse con Facebook</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 