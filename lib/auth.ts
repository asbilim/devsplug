import { getServerSession } from "next-auth";

/**
 * Gets authorization headers for API requests
 * @returns Authorization headers or empty object if no session
 */
export async function getAuthHeaders() {
  const session = await getServerSession();

  if (!session?.user) {
    return {};
  }

  // This assumes your backend expects a token in the Authorization header
  // Adjust as needed for your specific backend authentication requirements
  return {
    Authorization: `Bearer ${(session as any).accessToken || ""}`,
  };
}
