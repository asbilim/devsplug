const motivationPath = process.env.NEXT_PUBLIC_USER_BIO_EDIT_PATH;
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const editMotivation = async (data, token) => {
  
  const endpoint = backendUrl + motivationPath;
  return fetch(endpoint, {
    next: { revalidate: 460, tags: ["questions"] },
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((answer) => answer.json())
    .then((response) => response)
    .catch((error) => console.log(error));
};
