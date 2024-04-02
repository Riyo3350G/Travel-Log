import React from "react";
import {
  GoogleMap,
  Marker,
  LoadScript,
  InfoWindow,
} from "@react-google-maps/api";
import { useState } from "react";
import { Modal, Row, Col, Form, Button } from "react-bootstrap";
import { locationsApi } from "./api";

function LocationAddModal({ show, handleClose }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState([]);
  const [markerPosition, setMarkerPosition] = useState({
    lat: 37.7749,
    lng: -122.4194,
  });

  const handleSubmit = async () => {
    const images = await Promise.all(
      image.map(async (file) => {
        return await getBase64(file);
      })
    );

    const userId = localStorage.getItem("userId");

    try {
      const response = await locationsApi(userId, name, category, description, images, markerPosition.lng, markerPosition.lat);

      if (response.ok) {
        console.log("Location added successfully");
        handleClose();
      } else {
        console.error("Failed to add location");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = (event) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files); // Convert FileList to Array
      setImage(filesArray); // Update the state
    }
  };

  const handleClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarkerPosition({ lat, lng });
  };

  const containerStyle = {
    width: "100%",
    height: "100vh",
  };

  return (
    <div>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} controlId="formHorizontalName">
              <Form.Label column sm={2}>
                Name:
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formHorizontalCategory">
              <Form.Label column sm={2}>
                Category:
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formHorizontalDescription">
              <Form.Label column sm={2}>
                Description:
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formHorizontalImage">
              <Form.Label column sm={2}>
                Image:
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleImageChange}
                />
              </Col>
            </Form.Group>

            <GoogleMap
              mapContainerStyle={containerStyle}
              center={markerPosition} // Center the map at the marker position
              zoom={12}
              onClick={handleClick}
            >
              {/* Step 3: Use the state for the marker's position */}
              <Marker
                position={markerPosition}
                onClick={() => {
                  // Marker click handler if needed
                }}
              >
                {/* Optional: Showing an InfoWindow */}
                <InfoWindow position={markerPosition}>
                  <div>Selected Location</div>
                </InfoWindow>
              </Marker>
            </GoogleMap>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LocationAddModal;
