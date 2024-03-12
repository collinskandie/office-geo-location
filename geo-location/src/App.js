import React, { useState } from "react";
import Map from "./components/Map";
import { InfoWindow } from "@react-google-maps/api";
import axios from 'axios/axios';

const App = () => {
  const kenyaCenter = { lat: 1.2921, lng: 36.8219 }; // Coordinates for Kenya
  const zoom = 6;

  const markers = [
    {
      id: 1,
      position: { lat: 1.2921, lng: 36.8219 }, // Default marker at Kenya center
      infoWindow:
        "NTSA Head Office, Hill Park Building, Upper Hill Road, Nairobi",
    },
    {
      id: 2,
      position: { lat: 0.514277, lng: 35.269779 }, // Default marker at Kenya center
      infoWindow: "NTSA Nakuru - Kijabe Street, Kijabe Row, Kijabe Road",
    },
    {
      id: 3,
      position: { lat: -4.004924940745237, lng: 39.58033991894221 },
      infoWindow:
        "NTSA Mombasa - Imaara Building, 1st Floor, Dedan Kimathi Ave. (Opp. Pandya Memorial Hospital)",
    },
    {
      id: 4,
      position: { lat: -1.2758736789327043, lng: 36.80677405644729 },
      infoWindow: "NTSA Machakos - Naivas Building, KRA Offices, 3rd Floor",
    },
    {
      id: 5,
      position: { lat: -1.0432089766250636, lng: 37.093205053729605 },
      infoWindow:
        "NTSA Thika - Thika Arcade, 2nd Floor, Kenyatta Highway, Thika Town",
    },
    {
      id: 6,
      position: { lat: 0.04540310361695046, lng: 37.6495577383846 },
      infoWindow:
        "NTSA Meru - Njuri Ncheke Street, Off Meru-Maua Road, Meru Town",
    },
    {
      id: 7,
      position: { lat: -0.5424175472825674, lng: 37.47747342489206 },
      infoWindow: "NTSA Embu- Embu Town, Off Kenyatta Highway, Embu Town",
    },
    {
      id: 8,
      position: { lat: 0.5201361389675014, lng: 35.27427650954801 },
      infoWindow: "NTSA Eldoret - Eldoret Town",
    },
    {
      id: 9,
      position: { lat: -0.36814441317769553, lng: 35.285387453726045 },
      infoWindow: "NTSA Kericho",
    },
    {
      id: 10,
      position: { lat: 0.28100465903447464, lng: 34.75341558255804 },
      infoWindow: "NTSA Kakamega",
    },
    {
      id: 11,
      position: { lat: -0.6736731635560205, lng: 34.77246489120691 },
      infoWindow: "NTSA Kisii",
    },
    {
      id: 12,
      position: { lat: -0.0987415537139883, lng: 34.750026239228646 },
      infoWindow: "NTSA Kisumu",
    },
    {
      id: 13,
      position: { lat: -3.3872187846541344, lng: 38.57298406724047 },
      infoWindow: "NTSA  Voi",
    },
    {
      id: 14,
      position: { lat: -0.47394533014087353, lng: 39.644999096056814 },
      infoWindow: "NTSA Garissa",
    },
  ];

  const [selectedMarker, setSelectedMarker] = useState(null);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  return (
    <div>
      <h1>NTSA Regional Offices</h1>
      <Map
        center={kenyaCenter}
        zoom={zoom}
        markers={markers}
        onMarkerClick={handleMarkerClick}
      />

      {selectedMarker && (
        <InfoWindow
          position={selectedMarker.position}
          onCloseClick={() => setSelectedMarker(null)}
        >
          <div>{selectedMarker.infoWindow}</div>
        </InfoWindow>
      )}
    </div>
  );
};

export default App;
