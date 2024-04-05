const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
const leaderboardPath = process.env.NEXT_PUBLIC_USER_LEADERBOARD_PATH;

export const getLeaderBoard = async () => {
  const endpoint = backendUrl + leaderboardPath;

  return fetch(endpoint, {
    next: { revalidate: 460, tags: ["classement"] },
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((answer) => answer.json())
    .then((response) => response)
    .catch((error) => console.log(error));
};
