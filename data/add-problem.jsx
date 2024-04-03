const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const productPath = process.env.NEXT_PUBLIC_PROBLEM_ADD_PATH;
const questionAnswerPath = process.env.NEXT_PUBLIC_QUESTION_SUBMIT_PATH;
const quizCreatePath = process.env.NEXT_PUBLIC_CREATE_PROBLEM_QUIZ;
const imageSubmitPath = process.env.NEXT_PUBLIC_PROBLEM_IMAGE_SUBMIT_PATH;

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

export const answerQuestion = async (data, token) => {
  const endpoint = backendUrl + questionAnswerPath;
  return fetch(endpoint, {
    next: { revalidate: 460, tags: ["questions"] },
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

export const createProblemQuiz = async (data, token) => {
  const endpoint = backendUrl + quizCreatePath;
  return fetch(endpoint, {
    next: { revalidate: 460, tags: ["questions"] },
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

export const submitCodeImage = async (data, token) => {
  const endpoint = backendUrl + imageSubmitPath;
  return fetch(endpoint, {
    next: { revalidate: 460, tags: ["questions"] },
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: data,
  })
    .then((answer) => answer.json())
    .then((response) => response)
    .catch((error) => console.log(error));
};
