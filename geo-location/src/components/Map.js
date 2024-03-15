import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";

import { useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];
const google_api = process.env.REACT_APP_GOOGLE_API_KEY; // Replace with your API key
console.log(google_api);

const Map = ({ center, zoom, markers, onMarkerClick }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: google_api,
    libraries,
  });

  useEffect(() => {
    if (loadError) {
      console.error("Error loading maps:", loadError);
    }
    setIsMounted(true);
  }, [loadError]);

  const renderMap = () => {
    return (
      <div>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "800px" }}
            zoom={zoom}
            center={center}
          >
            {isMounted &&
              markers.map((marker) => (
                <Marker
                  key={marker.id}
                  position={marker.position}
                  onClick={() => onMarkerClick(marker)}
                />
              ))}
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                onClick={() => onMarkerClick(marker)}
              >
                {selectedMarker === marker && (
                  <InfoWindow onCloseClick={() => setSelectedMarker(marker.id)}>
                    <div>{marker.infoWindow}</div>
                  </InfoWindow>
                )}
              </Marker>
            ))}
          </GoogleMap>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
  };

  return isLoaded ? renderMap() : <div>Loading...</div>;
};

export default Map;
