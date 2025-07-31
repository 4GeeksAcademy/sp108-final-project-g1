
import { jwtDecode } from 'jwt-decode';

 export const checkAuth = () => {
     
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {

        throw new Error('No autenticado');
      }
      
      const decoded = jwtDecode(token);

      // Verificar expiración
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        throw new Error('Token expirado');
      }

      return decoded.user_id;
  };