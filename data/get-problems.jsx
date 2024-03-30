const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const productPath = process.env.NEXT_PUBLIC_PROBLEMS_PATH;
const problemPath = process.env.NEXT_PUBLIC_PROBLEM_GET_PATH;

export const getProblems = async () => {
  const endpoint = backendUrl + productPath;

  return fetch(endpoint, {
    next: { revalidate: 460, tags: ["problems"] },
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((answer) => answer.json())
    .then((response) => response)
    .catch((error) => console.log(error));
};

export const getSingleProblem = async (data) => {
  const endpoint = backendUrl + problemPath;

  return fetch(endpoint, {
    next: { revalidate: 460, tags: ["problem"] },
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((answer) => answer.json())
    .then((response) => response)
    .catch((error) => console.log(error));
};
