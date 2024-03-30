const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const productPath = process.env.NEXT_PUBLIC_PROBLEM_ADD_PATH;

export const addProblem = async (data, token) => {
  const endpoint = backendUrl + productPath;
  return fetch(endpoint, {
    next: { revalidate: 460, tags: ["problems"] },
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(data),
  })
    .then((answer) => answer.json())
    .then((response) => response)
    .catch((error) => console.log(error));
};
