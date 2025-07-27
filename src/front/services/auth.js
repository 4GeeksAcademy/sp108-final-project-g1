let host = import.meta.env.VITE_BACKEND_URL;

export const login = async (dataToSend) => {
    const uri = `${host}api/login`;
 
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend)
    };
    
    try {
        const response = await fetch(uri, options);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al iniciar sesión');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en login:', error);
        throw error;
    }
};

export const register = async (dataToSend) => {
    const uri = `${host}api/register`;
    
    try {
        const response = await fetch(uri, {
            method: 'POST',
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify(dataToSend)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al registrar');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en register:', error);
        throw error;
    }
};