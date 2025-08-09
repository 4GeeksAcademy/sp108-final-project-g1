import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getProfile } from "../services/users";

export const useAuth = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getProfile();
        dispatch({ type: "currentUser", payload: userData });
      } catch (err) {
        console.error("Error autenticación:", err);
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        dispatch({ type: "currentUser", payload: null });
        navigate("/login");
      }
    };

    // Solo pedimos el perfil si no está ya en store
    if (!store.currentUser) {
      fetchUser();
    }
  }, [store.currentUser, dispatch, navigate]);

  return store.currentUser;
};