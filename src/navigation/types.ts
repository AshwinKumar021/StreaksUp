import type { OnboardingSlide } from "@/types";

export type AuthRouteParams = {
  onboarding: undefined;
  login: undefined;
};

export type MainTabParams = {
  home: undefined;
  profile: undefined;
};

export type RootRouteParams = {
  index: undefined;
  "(auth)": undefined;
  "(tabs)": undefined;
};

export type { OnboardingSlide };
