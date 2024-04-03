import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { PersonCircle, Map, ChatSquareText, House } from "react-bootstrap-icons";
import LocationAddModal from "../pages/locations/locationAddModal";
import { logout } from "../pages/login/api";
import UserProfileModal from "./userProfileModal";

function NavBar() {
  const [show, setShow] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const userName = localStorage.getItem("username");

  function handleClose() {
    setShow(false);
  }

  function handleProfileClose() {
    setShowProfile(false);
  }

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand href="/">Travel Log</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: "100px" }} navbarScroll>
              <Nav.Link href="/"><House /> Home</Nav.Link>
              <Nav.Link href="/my-locations"><Map /> My Locations</Nav.Link>
              <Nav.Link href="/my-comments"><ChatSquareText /> My Comments</Nav.Link>
            </Nav>
            <div className="d-flex align-items-center">
              <Button variant="outline-success" onClick={() => setShow(true)} className="me-3">
                Add Location
              </Button>
              <NavDropdown title={<><PersonCircle /> {userName}</>} id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => setShowProfile(true)}>Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <LocationAddModal show={show} handleClose={handleClose} />
      <UserProfileModal show={showProfile} handleClose={handleProfileClose} />
    </>
  );
}

export default NavBar;
