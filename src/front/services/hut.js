let host = import.meta.env.VITE_BACKEND_URL;
const uri = `${host}api/huts`;


export const getHutsDetail= async() =>{

    try {
        const response = await fetch(uri);
        const data = await response.json();
        console.log(data)
    // let defaultPosition = {
    //   lat: 40.4168,
    //   lng: -3.7038
    // };
    // if (data.length > 0 && data[0].position) {
    //   defaultPosition = {
    //     lat: data[0].position.lat,
    //     lng: data[0].position.lng
    //   };
    // }

    return data.results

      } catch (error) {
        console.error("Error fetching huts:", error);
      }
    };
 



