import type { Challenge } from "@/app/actions/challenges";

export interface FullScreenEditorProps {
  challenge: Challenge;
  params: {
    slug: string;
    locale: string;
  };
}

export interface ChallengeOption {
  id: string;
  slug: string;
  title: string;
}

export interface EditorState {
  code: string;
  selectedLanguage: string;
  documentation: string;
  isPrivate: boolean;
}
