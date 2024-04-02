import React, { useState, useEffect } from "react";
import {
  ListGroup,
  Button,
  Container,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import { Pencil, Trash, CheckLg, X } from "react-bootstrap-icons"; // Importing additional icons for Save and Cancel
import { getCommentsByUserId, putComment, deleteComment } from "./api";

const MyComments = () => {
  const [comments, setComments] = useState([]);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    getCommentsByUserId(userId)
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleEdit = (id, content) => {
    console.log(id, content);
    setEditCommentId(id);
    setEditContent(content);
    console.log(id, content);
  };

  const handleDelete = (id) => {
    deleteComment(id)
      .then((response) => {
        if (response.ok) {
          setComments(comments.filter((comment) => comment._id !== id));
        } else {
          console.error("Failed to delete comment");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleSave = (id) => {
    putComment(id, editContent)
      .then((response) => {
        if (response.ok) {
          setComments(
            comments.map((comment) =>
              comment._id === id
                ? { ...comment, comment: editContent }
                : comment
            )
          );
          setEditCommentId(null);
          setEditContent("");
        } else {
          console.error("Failed to update comment");
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleCancel = () => {
    setEditCommentId(null);
    setEditContent("");
  };

  return (
    <Container>
      <h1>My Comments</h1>
      <ListGroup>
        {comments.map((comment) => (
          <ListGroup.Item
            key={comment._id}
            className="d-flex justify-content-between align-items-center"
          >
            {editCommentId === comment._id ? (
              <div className="w-100 d-flex justify-content-between">
                <FormControl
                  autoFocus
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="me-2" // Add some spacing
                />
                <Button
                  variant="success"
                  onClick={() => handleSave(comment._id)}
                  className="me-1"
                >
                  <CheckLg />
                </Button>
                <Button variant="secondary" onClick={handleCancel}>
                  <X />
                </Button>
              </div>
            ) : (
              <div>{comment.comment}</div>
            )}
            <div>
              {editCommentId !== comment._id && (
                <>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handleEdit(comment._id, comment.comment)}
                    className="m-1"
                  >
                    <Pencil /> {/* Edit Icon */}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(comment._id)}
                  >
                    <Trash /> {/* Delete Icon */}
                  </Button>
                </>
              )}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default MyComments;
