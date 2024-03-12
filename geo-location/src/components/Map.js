import React, { useState } from "react";
import {
  GoogleMap,
  AdvancedMarkerElement,
  InfoWindow,
} from "@googlemaps/google-maps-services-js"; // Using AdvancedMarkerElement
import { useLoadScript } from "@react-google-maps/api";
import axios from "axios/axios";

const libraries = ["places"]; // Include the Places library for geocoding
const google_api = "AIzaSyA2l5gu6xLq6SRnoj4vTWsqyHSD75WJAuc";
console.log("google_api", google_api);

const Map = ({ center, zoom, markers, onMarkerClick }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: google_api, // Replace with your API key
    libraries,
  });

  if (loadError) return "Error loading maps";
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "400px" }}
      zoom={zoom}
      center={center}
    >
      {markers.map((marker) => (
        <AdvancedMarkerElement // Using AdvancedMarkerElement
          key={marker.id}
          position={marker.position}
          onClick={() => onMarkerClick(marker)}
        >
          {selectedMarker === marker && (
            <InfoWindow onCloseClick={() => setSelectedMarker(null)}>
              <div>{marker.infoWindow}</div>
            </InfoWindow>
          )}
        </AdvancedMarkerElement>
      ))}
    </GoogleMap>
  );
};

export default Map;
