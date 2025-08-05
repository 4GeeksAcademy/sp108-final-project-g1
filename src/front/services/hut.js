let host = import.meta.env.VITE_BACKEND_URL;
const uri = `${host}api/huts`;


export const getHutsDetail= async() =>{

    try {
        const response = await fetch(uri);
        const data = await response.json();
        console.log(data)

    return data.results

      } catch (error) {
        console.error("Error fetching huts:", error);
      }
    };
 



