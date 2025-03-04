export interface Challenge {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  points: number;
  estimated_time: number;
  category: {
    id: number;
    name: string;
    icon: string;
    slug: string;
  };
  tags: string[];
  completion_rate: number;
  user_status: string | null;
  is_subscribed?: boolean;
  subscription_status?: {
    is_subscribed: boolean;
    attempts_count: number;
    max_attempts: number | null;
  };
  content: string;
  attachments?: Array<{
    id: number;
    title: string;
    file: string;
  }>;
}
