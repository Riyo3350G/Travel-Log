import Comment from "../models/commentModel.js";
import Location from "../models/locationModel.js";
import User from "../models/userModel.js";

class CommentController {
    static async postComment(req, res) {
        const { userId, locationId, comment } = req.body;
        if (!userId) {
        return res.status(400).json({ error: "Missing userId" });
        }
        const user = await User.findById(userId);
        if (!user) {
        return res.status(404).json({ error: "User not found" });
        }
        if (!locationId) {
        return res.status(400).json({ error: "Missing locationId" });
        }
        const location = await Location.findById(locationId);
        if (!location) {
        return res.status(404).json({ error: "Location not found" });
        }
        if (!comment) {
        return res.status(400).json({ error: "Missing comment" });
        }
        const newComment = await Comment.createComment(userId, locationId, comment);
        return res.status(201).json(newComment);
    }
    
    static async deleteComment(req, res) {
        const { id } = req.params;
        const comment = await Comment.deleteComment(id);
        if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
        }
        return res.status(200).json(comment);
    }

    static async putComment(req, res) {
        const { id } = req.params;
        const { comment } = req.body;
        if (!id) {
        return res.status(400).json({ error: "Missing commentId" });
        }
        const oldComment = await Comment.findById(id);
        if (!oldComment) {
        return res.status(404).json({ error: "Comment not found" });
        }
        if (!comment) {
        return res.status(400).json({ error: "Missing comment" });
        }
        const updatedComment = await Comment.findByIdAndUpdate(id, { comment }, { new: true });
        return res.status(200).json(updatedComment);
    }

    static async getComment(req, res) {
        const { commentId } = req.params;
        const comment = await Comment.getComment(commentId);
        if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
        }
        return res.status(200).json(comment);
    }

    static async getCommentsByLocationId(req, res) {
        const { id } = req.params;
        const comments = await Comment.getComments(id);
        if (!comments) {
        return res.status(404).json({ error: "Comments not found" });
        }
        return res.status(200).json(comments);
    }

    static async getCommentsByUserId(req, res) {
        const { id } = req.params;
        const comments = await Comment.getCommentsByUserId(id);
        return res.status(200).json(comments);
    }

}

export default CommentController;