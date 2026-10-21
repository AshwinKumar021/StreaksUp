export type AuthSession = {
  userId: string;
  email: string;
  name: string;
  memberSince: string;
};

export type Habit = {
  id: string;
  name: string;
  time: string;
  icon: string;
  color: string;
  completed: boolean;
};

export type OnboardingSlide = {
  id: string;
  title: string;
  description: string;
  illustration: "habits" | "streak" | "progress" | "motivation";
};
