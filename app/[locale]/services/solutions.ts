export async function getPublicSolutions() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/solutions/public/`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch solutions");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching public solutions:", error);
    return [];
  }
}
