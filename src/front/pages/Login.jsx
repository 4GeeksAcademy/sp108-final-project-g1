import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useGlobalReducer from "../hooks/useGlobalReducer";
import { login, requestPasswordReset } from "../services/auth"; // Asegúrate de agregar esta función en tu servicio


const Login = () => {
  const { dispatch } = useGlobalReducer();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showResetForm, setShowResetForm] = useState(false); // Nuevo estado para controlar el formulario de recuperación
  const [resetEmail, setResetEmail] = useState(''); // Email para recuperación
  const [resetSuccess, setResetSuccess] = useState(false); // Estado para mensaje de éxito

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

    try {
      const result = await login({
        email: formData.email,
        password: formData.password
      });

      const storage = formData.rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', result.access_token);
      storage.setItem('currentUser', JSON.stringify(result.results))
      dispatch({ type: 'token', payload: result.access_token });
      dispatch({ type: 'isLogged', payload: true });
      dispatch({ type: 'currentUser', payload: result.results });

      navigate('/');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      dispatch({
        type: 'handle_alert',
        payload: {
          text: 'Error al iniciar sesión',
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
      email: '',
      password: '',
      rememberMe: false
    });
    dispatch({
      type: 'handle_alert',
      payload: {
        text: 'Cancelar',
        background: 'danger',
        visible: true
      }
    })
    navigate('/');
  };

  // Función para manejar el envío del formulario de recuperación
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await requestPasswordReset(resetEmail);
      setResetSuccess(true);
    } catch (err) {
      setError(err.message || 'Error al solicitar recuperación de contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-brown-150 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://res.cloudinary.com/dmtvki1tj/video/upload/v1753687889/5081297_Rural_Countryside_1920x1080_tdybmx.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      <div className='relative z-10 px-4 py-12 wood-bg border-8 border-green-150 sm:mx-auto sm:w-full sm:max-w-md rounded-lg shadow-xl'>
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-green-250">
            {showResetForm ? 'Recuperar contraseña' : 'Iniciar sesión'}
          </h2>
          <p className="mt-2 text-center text-sm text-brown-150">
            {showResetForm ? (
              'Ingresa tu email para recibir instrucciones'
            ) : (
              <>
                O{' '}
                <Link to="/register" className="font-medium text-green-150 hover:text-green-250">
                  crea una cuenta nueva
                </Link>
              </>
            )}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-green-150 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            {resetSuccess ? (
              <div className="text-center">
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
                  ¡Listo! Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.
                </div>
                <button
                  onClick={() => {
                    setShowResetForm(false);
                    setResetSuccess(false);
                  }}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Volver al login
                </button>
              </div>
            ) : showResetForm ? (
              <form className="space-y-6" onSubmit={handlePasswordReset}>
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                    Correo electrónico
                  </label>
                  <div className="mt-1">
                    <input
                      id="reset-email"
                      name="resetEmail"
                      type="email"
                      autoComplete="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 mr-2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Enviando...' : 'Enviar instrucciones'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowResetForm(false)}
                    className="flex-1 ml-2 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
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
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                      Recordarme
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowResetForm(true)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <div className="flex justify-between">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 mr-2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 ml-2 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;