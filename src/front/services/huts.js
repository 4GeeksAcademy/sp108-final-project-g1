export const getHuts = async () => {
    try {
        const response = await fetch('https://friendly-guide-g4v6q796wprf9q67-3001.app.github.dev/api/huts/', {
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error('Error al cargar los datos');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching huts:", error);
        throw error;
    }
};