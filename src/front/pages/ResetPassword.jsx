import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useGlobalReducer from "../hooks/useGlobalReducer";
import { resetPassword } from "../services/auth"; // Importa la nueva función

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await resetPassword(token, newPassword); // Usa la función del servicio
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Token no válido</h2>
          <p>El enlace de recuperación es inválido o ha expirado.</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Volver al login
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">¡Contraseña actualizada!</h2>
          <p>Tu contraseña ha sido restablecida correctamente.</p>
          <p>Serás redirigido al login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Restablecer contraseña</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
              minLength="6"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
              minLength="6"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Procesando...' : 'Restablecer contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;