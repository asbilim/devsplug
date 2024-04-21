const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const productPath = process.env.NEXT_PUBLIC_PROBLEMS_PATH;
const problemPath = process.env.NEXT_PUBLIC_PROBLEM_GET_PATH;
const problemQuizPath = process.env.NEXT_PUBLIC_PROBLEM_QUIZ_GET_PATH;
const problemQuizStatusPath =
  process.env.NEXT_PUBLIC_PROBLEM_QUIZ_CHECK_RESULTS;

const problemGetScore = process.env.NEXT_PUBLIC_PROBLEM_GET_SCORE_PATH;
const problemRatingGetPath = process.env.NEXT_PUBLIC_PROBLEM_RATINGS_GET_PATH;
const getChallengeSolutionPath =
  process.env.NEXT_PUBLIC_GET_CHALLENGE_SOLUTIONS;
const problemSolutionAddPath =
  process.env.NEXT_PUBLIC_CHALLENGE_SOLUTION_ADD_PATH;
const getSolutionLikesPath = process.env.NEXT_PUBLIC_GET_SOLUTION_LIKES;
const getSolutionDisLikesPath = process.env.NEXT_PUBLIC_GET_SOLUTION_DISLIKES;
const getSolutionCommentsPath = process.env.NEXT_PUBLIC_GET_SOLUTION_COMMENTS;

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

export const getSolutions = async () => {
  const endpoint = backendUrl + getChallengeSolutionPath;

  return fetch(endpoint, {
    next: { revalidate: 460, tags: ["solutions"] },
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((answer) => answer.json())
    .then((response) => response)
    .catch((error) => console.log(error));
};

export const getSolutionsLikes = async (uid) => {
  const endpoint = backendUrl + getSolutionLikesPath + uid + "/";

  return fetch(endpoint, {
    next: { revalidate: 460, tags: ["likes"] },
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((answer) => answer.json())
    .then((response) => response)
    .catch((error) => console.log(error));
};

export const getSolutionsCommentsContent = async (uid) => {
  const endpoint =
    backendUrl + "/challenges/comments/content/by-problem-item/" + uid + "/";

  return fetch(endpoint, {
    next: { revalidate: 460, tags: ["comments-contents"] },
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((answer) => answer.json())
    .then((response) => response)
    .catch((error) => console.log(error));
};

export const getSolutionsDisLikes = async (uid) => {
  const endpoint = backendUrl + getSolutionDisLikesPath + uid + "/";

  return fetch(endpoint, {
    next: { revalidate: 460, tags: ["dislikes"] },
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((answer) => answer.json())
    .then((response) => response)
    .catch((error) => console.log(error));
};

export const getSolutionsComments = async (uid) => {
  const endpoint = backendUrl + getSolutionCommentsPath + uid + "/";

  return fetch(endpoint, {
    next: { revalidate: 460, tags: ["comments"] },
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

export const addComment = async (token, uid, data) => {
  const endpoint =
    backendUrl + "/challenges/comments/content/by-problem-item/" + uid + "/";

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
