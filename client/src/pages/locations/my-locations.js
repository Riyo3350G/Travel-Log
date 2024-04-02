// MyLocations.js
import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { deleteLocation, getLocationsByUserId } from "./api";

const MyLocations = () => {
  const [locations, setLocations] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    getLocationsByUserId(userId)
      .then((response) => response.json())
      .then((data) => {
        setLocations(data.modifiedLocations);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleDelete = (id) => {
    deleteLocation(id)
      .then((response) => {
        if (response.ok) {
          setLocations(locations.filter((location) => location.id !== id));
        } else {
          console.error("Failed to delete location");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <Container>
      <h1 className="text-center mb-4">My Locations</h1>
      {locations && locations.length > 0 ? (
        <Row>
          {locations.map((location) => (
            <Col key={location.id} sm={12} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm bg-white rounded">
                <Card.Img variant="top" src={location.image[0]} style={{ objectFit: 'cover', height: '200px' }} />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{location.name}</Card.Title>
                  <Card.Text>{location.description}</Card.Text>
                  <div className="mt-auto">
                    <Button
                      variant="primary"
                      onClick={() => history.push('/')}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => handleDelete(location.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : locations === null ? (
        <div>Loading...</div> // This is shown when the locations are null (initially, when data is being fetched)
      ) : (
        <Alert variant="info" className="w-100 text-center">
          No locations
        </Alert>
      )}
    </Container>
  );
};

export default MyLocations;
