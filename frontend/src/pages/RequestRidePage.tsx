import { useEffect, useState } from "react";
import { decodePolyline } from "@/lib/google-maps.ts";
import { EstimateRideResponseDto } from "@/@types/ride.ts";
import { ConfirmRide } from "@/components/ConfirmRide.tsx";
import { LocationPath } from "@/@types/location.ts";
import { Map } from "@/components/map.tsx";
import { RequestRideForm } from "@/components/RequestRideForm.tsx";
import { useSession } from "@/providers/Session.tsx";

import { LoginForm } from "@/components/LoginForm.tsx";


const defaultCenter = {
  lat: -23.55052, // Latitude de São Paulo
  lng: -46.633308, // Longitude de São Paulo
};


export default function RequestRidePage() {
  const { customer } = useSession()
  const [routePath, setRoutePath] = useState<google.maps.LatLngLiteral[] | null>(null)
  const [estimative, setEstimative] = useState<EstimateRideResponseDto | null>(null)
  const [initialLocation, setInitialLocation] = useState(defaultCenter);
  const [requestedLocation, setRequestedLocation] = useState<LocationPath | null>(null);

  const handleResult = (estimative: EstimateRideResponseDto, location: LocationPath) => {
    const route = estimative.routeResponse.routes[0]
    const encodedPolyline = route.polyline.encodedPolyline
    const decodedPolyline = decodePolyline(encodedPolyline)

    setEstimative(estimative)
    setRoutePath(decodedPolyline)
    setRequestedLocation(location)
  }

  const handleCancel = () => {
    setEstimative(null)
    setRoutePath(null)
    setRequestedLocation(null)
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setInitialLocation({ lat: latitude, lng: longitude });
        },
        (positionError) => {
          console.error(positionError);

          setInitialLocation(defaultCenter);
        }
      );
    } else {

      setInitialLocation(defaultCenter);
    }
  }, []);


  return (
    <div className="container mx-auto">
      <div className='grid grid-rows-[minmax(auto, 100vh),minmax(auto, 100vh)] md:grid-rows-1 md:grid-cols-2 h-[calc(100vh-64px)] pt-8 px-2 md:px-12 lg:px-18 max-h-[calc(100vh-64px)]'>
        <div className='space-y-12 overflow-auto max-h-full place-self-center px-2 md:px-4 order-2 lg:order-1'>
          {
            !customer ?
              (
                <LoginForm />
              )
              :
              estimative && requestedLocation ? (
                  <ConfirmRide
                    ride={estimative}
                    requestedLocation={requestedLocation}
                    onCancel={
                      handleCancel
                    }
                  />
                ) :

                <RequestRideForm onResult={handleResult}/>
          }
        </div>

        <div className="order-1 lg:order-2 min-h-[200px] mb-2">

        <Map routePath={routePath} initialLocation={initialLocation || defaultCenter}/>
        </div>

      </div>
    </div>
  );
}

