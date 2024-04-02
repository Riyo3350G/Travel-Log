import React, { useEffect, useState } from "react";
import { Modal, Carousel, Button, Form } from "react-bootstrap";
import { getLocationComments, postComment } from "./api"; // Assume addLocationComment is your API method to add a comment
import "./locationViewModal.css";

function LocationViewModal({ show, handleClose, choosed }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState(""); // State to store the new comment input

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getLocationComments(choosed?.id);
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          console.error("Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (choosed) {
      fetchComments();
    }
  }, [choosed]);

  const handleAddComment = async () => {
    try {
      // Assuming your API requires the location ID and the comment text
      const userId = localStorage.getItem("userId");
      const isSuccess = await postComment(choosed.id, userId, newComment);
      if (isSuccess) {
        setComments([...comments, { comment: newComment }]);
        setNewComment(""); // Clear the input field
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancelComment = () => {
    setNewComment(""); // Clear the input field
  };

  return (
    <div>
      <Modal show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>View Location</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="location-carousel-container">
            <Carousel slide={false} indicators={false}>
              {choosed && choosed.image.map((image, index) => (
                <Carousel.Item key={index}>
                  <img
                    src={image}
                    className="d-block w-100 location-carousel-image"
                    alt={`Location ${index}`}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
          <div className="location-info">
            <h3 className="location-name">{choosed?.name}</h3>
            <p className="location-category">{choosed?.category}</p>
            <p className="location-description">{choosed?.description}</p>
          </div>
          <div className="location-comments">
            <h3>Comments</h3>
            <ul className="comment-list">
              {comments.map((comment, index) => (
                <li className="comment-item" key={index}>
                  <p className="comment-text">{comment.comment}</p>
                </li>
              ))}
            </ul>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddComment} disabled={!newComment.trim()}>
              Add Comment
            </Button>
            <Button variant="secondary" onClick={handleCancelComment} style={{ marginLeft: "10px" }}>
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default LocationViewModal;
