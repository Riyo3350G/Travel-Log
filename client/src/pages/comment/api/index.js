const getCommentsByUserId = async (userId) => {
    return fetch(`/api/users/${userId}/comments`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        },
    });
}

const putComment = async (commentId, comment) => {
    return fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        comment,
        }),
    });
}

const deleteComment = async (commentId) => {
    return fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        },
    });
}

export { getCommentsByUserId, putComment, deleteComment };
