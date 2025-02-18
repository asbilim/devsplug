"use server";

import { unstable_cache } from "next/cache";

export interface Challenge {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  points: number;
  estimated_time: number;
  category: {
    name: string;
    icon: string;
  };
}

export const getChallenges = unstable_cache(
  async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/challenges/listings`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch challenges");
    }

    return res.json() as Promise<Challenge[]>;
  },
  ["challenges-list"],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ["challenges"],
  }
);
