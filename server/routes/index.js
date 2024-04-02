import AppController from "../controllers/AppController.js";
import AuthController from "../controllers/AuthController.js";
import LocationController from "../controllers/LocationController.js";
import CommentController from "../controllers/CommentController.js";
import express from "express";

function routesController(app) {
  const router = express.Router();
  app.use("/api", router);
  router.get("/status", (req, res) => {
    AppController.getStatus(req, res);
  });
  router.post("/login", (req, res) => {
    AuthController.login(req, res);
  });
  router.post("/signup", (req, res) => {
    AuthController.signup(req, res);
  });
  router.get("/users/me", (req, res) => {
    AuthController.getConnectUser(req, res);
  });
  router.put("/users/me", (req, res) => {
    AuthController.updateUser(req, res);
  });


  router.post("/locations", (req, res) => {
    LocationController.postLocation(req, res);
  });
  router.get("/locations", (req, res) => {
    LocationController.getLocations(req, res);
  });
  router.get("/locations/:id", (req, res) => {
    LocationController.getLocation(req, res);
  });
  router.delete("/locations/:id", (req, res) => {
    LocationController.deleteLocation(req, res);
  });
  router.get("/users/:id/locations", (req, res) => {
    LocationController.getLocationsByUserId(req, res);
  });
  router.put("/locations/:id", (req, res) => {
    LocationController.putLocation(req, res);
  });


  router.post("/comments", (req, res) => {
    CommentController.postComment(req, res);
  });
  router.get("/comments", (req, res) => {
    CommentController.getComments(req, res);
  });
  router.get("/comments/:id", (req, res) => {
    CommentController.getComment(req, res);
  });
  router.delete("/comments/:id", (req, res) => {
    CommentController.deleteComment(req, res);
  });
  router.put("/comments/:id", (req, res) => {
    CommentController.putComment(req, res);
  });
  router.get("/locations/:id/comments", (req, res) => {
    CommentController.getCommentsByLocationId(req, res);
  });
  router.get("/users/:id/comments", (req, res) => {
    CommentController.getCommentsByUserId(req, res);
  });
}

export default routesController;
