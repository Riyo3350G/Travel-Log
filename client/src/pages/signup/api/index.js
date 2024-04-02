const signup = async (email, password, username, gender, phone, country) => {
  return fetch("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      username,
      gender,
      phone,
      country,
    }),
  });
};

export default signup;
