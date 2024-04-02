import Mongoose from "mongoose";


const Schema = Mongoose.Schema;

const commentSchema = new Schema({
    userId: { type: String, required: true },
    locationId: { type: String, required: true },
    comment: { type: String, required: true },
});

commentSchema.statics.createComment = async function(userId, locationId, comment) {
    const newComment = await this.create({
        userId,
        locationId,
        comment,
    });
    return newComment;
}

commentSchema.statics.deleteComment = async function(commentId) {
    const comment = await this.findByIdAndDelete(commentId);
    return comment;
}

commentSchema.statics.getComments = async function(locationId) {
    const comments = await this.find({ locationId: locationId });
    return comments;
}

commentSchema.statics.getComment = async function(commentId) {
    const comment = await this.findById(commentId);
    return comment;
}

commentSchema.statics.getCommentsByUserId = async function(userId) {
    const comments = await this.find({ userId });
    return comments;
}

const Comment = Mongoose.model("Comment", commentSchema);
export default Comment;