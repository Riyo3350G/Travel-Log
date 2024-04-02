import React, { useState } from "react";
import {
  GoogleMap,
  Marker,
  LoadScript,
} from "@react-google-maps/api";
import { useEffect } from "react";
import { getLocations } from "../pages/locations/api";
import LocationViewModal from "../pages/locations/locationViewModal";

function Maps() {
  const [markerPosition, setMarkerPosition] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [show, setShow] = useState(false);
  const [clickedLocation, setClickedLocation] = useState(null);

  function handleClose() {
    setShow(false);
  }

  const handleMarkerClick = (position) => {
    setClickedLocation(position);
    setShow(true);
  };

  const fetchLocations = async () => {
    try {
      const response = await getLocations();
      if (response.ok) {
        const data = await response.json();
        let locations = [];
        data.modifiedLocations.forEach((location) => {
          locations.push({
            id: location.id,
            name: location.name,
            description: location.description,
            category: location.category,
            image: location.image,
            lat: location.lat,
            lng: location.long,
          });
        });
        setMarkerPosition(locations);
      } else {
        console.error("Failed to fetch locations");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  useEffect(() => {
    fetchLocations();
  }, []);

  const containerStyle = {
    width: "100%",
    height: "90vh",
  };

  return (
    <>
      {/* <LoadScript googleMapsApiKey={mapsApiKey}> */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={markerPosition[0] || { lat: 1.3521, lng: 103.8198 }}
          zoom={12}
        >
          { markerPosition.map((position, index) => (
            <Marker position={position} key={index} onClick={() => handleMarkerClick(position)}>
            
          </Marker>
          ))}
          
        </GoogleMap>
      {/* </LoadScript> */}
      <LocationViewModal show={show} handleClose={handleClose} choosed={clickedLocation}/>
    </>
  );
}

export default React.memo(Maps);
