import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import { login } from "./api";
import { useHistory } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [show, setShow] = useState(false);
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await login(email, password, rememberMe);
      // console.log(btoa(`${email}:${password}`));
      if (response.status === 200) {
        console.log("User logged in successfully");
        setErrorMessage("");
        response.json().then((data) => {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.id);
          localStorage.setItem("username", data.username);
          history.push("/");
        });
      } else {
        console.error("Failed to log in");
        setErrorMessage("Failed to log in check your email and password");
        setShow(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(`Failed to log in: ${error}`);
      setShow(true);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Row>
        <Col>
          <Card className="shadow" style={{ width: "20rem" }}>
            <Card.Body>
              <Card.Title className="text-center mb-4">Login</Card.Title>
              <Form onSubmit={handleSubmit}>
                {errorMessage && (
                  <Alert
                    variant="danger"
                    onClose={() => setShow(false)}
                    dismissible
                  >
                    <Alert.Heading>{errorMessage}</Alert.Heading>
                  </Alert>
                )}
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicCheckbox">
                  <Form.Check
                    type="checkbox"
                    label="Remember me"
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3">
                  Login
                </Button>
                <Form.Text className="text-muted text-center mt-3">
                  Don't have an account? <a href="/signup">Sign up</a>
                </Form.Text>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
