const login = async (email, password, rememberMe) => {
  return fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(`${email}:${password}`)}`,
    },
    body: JSON.stringify({ rememberMe }),
  });
};

const logout = async (token) => {
  return fetch("/api/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Token": token,
    },
  });
};

const getProfile = async (token) => {
  return fetch("/api/users/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Token": token,
    },
  });
};

const updateProfile = async (token, profile) => {
    return fetch("/api/users/me", {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        "X-Token": token,
        },
        body: JSON.stringify(profile),
    });
    };

export { login, logout, getProfile, updateProfile };
