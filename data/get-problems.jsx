const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const productPath = process.env.NEXT_PUBLIC_PROBLEMS_PATH;
const problemPath = process.env.NEXT_PUBLIC_PROBLEM_GET_PATH;
const problemQuizPath = process.env.NEXT_PUBLIC_PROBLEM_QUIZ_GET_PATH;
const problemQuizStatusPath =
  process.env.NEXT_PUBLIC_PROBLEM_QUIZ_CHECK_RESULTS;

const problemGetScore = process.env.NEXT_PUBLIC_PROBLEM_GET_SCORE_PATH;
const problemRatingGetPath = process.env.NEXT_PUBLIC_PROBLEM_RATINGS_GET_PATH;

const problemSolutionAddPath =
  process.env.NEXT_PUBLIC_CHALLENGE_SOLUTION_ADD_PATH;

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

export const getSingleProblemQuiz = async (data) => {
  const endpoint = backendUrl + problemQuizPath;

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

export const getSingleProblemQuizStatus = async (token, data) => {
  const endpoint = backendUrl + problemQuizStatusPath;

  return fetch(endpoint, {
    next: { revalidate: 460, tags: ["problem"] },
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

export const getProblemScore = async (token, data) => {
  const endpoint = backendUrl + problemGetScore;

  return fetch(endpoint, {
    next: { revalidate: 460, tags: ["problem"] },
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

export const getProblemRating = async (slug) => {
  const endpoint = backendUrl + problemRatingGetPath + slug + "/";

  return fetch(endpoint, {
    next: { revalidate: 460, tags: ["ratings"] },
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((answer) => answer.json())
    .then((response) => {
      return response;
    })
    .catch((error) => console.log(error.message));
};

export const addProblemRating = async (token, slug, data) => {
  const endpoint = backendUrl + problemRatingGetPath + slug + "/";

  return fetch(endpoint, {
    next: { revalidate: 460, tags: [""] },
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

export const addProblemSolution = async (token, slug, data) => {
  const endpoint = backendUrl + problemSolutionAddPath + slug + "/";

  return fetch(endpoint, {
    next: { revalidate: 460, tags: [""] },
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
