const locationsApi = async (userId, name, category, description, image, long, lat) => {
  return fetch("/api/locations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      name,
      category,
      description,
      image,
      long,
      lat,
    }),
  });
}

const getLocations = async () => {
  return fetch("/api/locations", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

const getLocationsByUserId = async (userId) => {
  return fetch(`/api/users/${userId}/locations`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

const deleteLocation = async (locationId) => {
  return fetch(`/api/locations/${locationId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

const postComment = async (locationId, userId, comment) => {
  return fetch(`/api/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      locationId,
      userId,
      comment,
    }),
  });
}

const getLocationComments = async (locationId) => {
  return fetch(`/api/locations/${locationId}/comments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export { locationsApi, getLocations, getLocationComments, postComment, getLocationsByUserId, deleteLocation };