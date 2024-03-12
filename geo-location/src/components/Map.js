import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";

import { useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];
const google_api = "AIzaSyA2l5gu6xLq6SRnoj4vTWsqyHSD75WJAuc"; // Replace with your API key

const Map = ({ center, zoom, markers, onMarkerClick }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: google_api,
    libraries,
  });

  useEffect(() => {
    if (loadError) {
      console.error("Error loading maps:", loadError);
    }
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
