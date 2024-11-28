import { GoogleMap, Polyline, useJsApiLoader, } from "@react-google-maps/api";
import { mapStyles } from "@/components/mapStyles.ts";


const containerStyle = {
  width: "100%",
  height: "100%",

};


const options = {
  disableDefaultUI: true, // Remove controles padrão,
  styles: mapStyles,
  language: 'pt-BR'
};

type MapProps = {
  routePath: google.maps.LatLngLiteral[] | null;
  initialLocation: google.maps.LatLngLiteral;
};

export const Map = ({ routePath, initialLocation }: MapProps) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    language: 'pt-BR',
  })

  // Verifique se routePath tem dados válidos, se não, use o ponto central padrão
  const validRoutePath = routePath && routePath.length > 0;
  const currentCenter = validRoutePath ? routePath[0] : initialLocation;


  const zoom = routePath ? 14 : 12;
  return (

    <>
      {isLoaded &&
          <GoogleMap
            // onLoad={onLoad}
              mapContainerStyle={containerStyle} center={currentCenter} zoom={zoom} options={options}>
            {validRoutePath && (
              <Polyline path={routePath} options={{
                strokeColor: "#000",
                strokeWeight: 4,
                strokeOpacity: 1,
              }}

              />
            )}
          </GoogleMap>
      }
    </>

  );
};
