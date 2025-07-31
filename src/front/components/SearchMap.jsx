import { useJsApiLoader } from '@react-google-maps/api';
import { Autocomplete } from '@react-google-maps/api';

const key_api_maps = import.meta.env.VITE_CLAVE_API_GOOGLE_MAPS

const SearchWithMap = () => {
    const [autocomplete, setAutocomplete] = useState(null);
    const [searchCenter, setSearchCenter] = useState(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: key_api_maps,
        libraries: ['places']
    });

    const onLoad = (autocomplete) => {
        setAutocomplete(autocomplete);
    };

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                setSearchCenter({
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                });
            }
        }
    };

    return (
        <div className="space-y-4">
            {isLoaded && (
                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                    <input
                        type="text"
                        placeholder="Buscar ubicación..."
                        className="w-full p-2 border rounded-md"
                    />
                </Autocomplete>
            )}

            <MapContainer center={searchCenter} />
        </div>
    );
};