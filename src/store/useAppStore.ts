import { create } from "zustand";

export interface UserProfile {
  username: string;
  avatar: string;
  email: string;
}

interface AppState {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;

  allContent: any[];
  setAllContent: (content: any[]) => void;
  activeStory: any | null;
  setActiveStory: (story: any | null) => void;
  myStories: any[];
  recommendedStories: any[];
  setMyStories: (stories: any[]) => void;
  setRecommendedStories: (stories: any[]) => void;
}

export const useAppStore = create<AppState>((set: any) => ({
  user: null,
  setUser: (user: UserProfile | null) =>
    set((state: AppState) => ({ ...state, user })),

  allContent: [],
  setAllContent: (allContent) => set({ allContent }),

  activeStory: null,
  setActiveStory: (activeStory) => set({ activeStory }),
  myStories: [],
  recommendedStories: [],
  setMyStories: (myStories: any[]) =>
    set((state: AppState) => ({ ...state, myStories })),
  setRecommendedStories: (recommendedStories: any[]) =>
    set((state: AppState) => ({ ...state, recommendedStories })),
}));
