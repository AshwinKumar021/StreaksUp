import { useEffect } from "react";
import { Stack, useRouter, useSegments, type Href } from "expo-router";
import useAuth from "@/hooks/useAuth";
import { useTheme } from "@/theme";

export default function RootNavigator() {
  const { colors } = useTheme();
  const { initialized, session, onboardingSeen } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const routeGroup: string | undefined = segments[0];

  useEffect(() => {
    if (!initialized || routeGroup === undefined || routeGroup === "index") return;

    if (routeGroup === "(tabs)" && !session) {
      router.replace(
        (onboardingSeen ? "/(auth)/login" : "/(auth)/onboarding") as Href,
      );
    } else if (routeGroup === "(auth)" && session) {
      router.replace("/(tabs)" as Href);
    }
  }, [initialized, onboardingSeen, router, routeGroup, session]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
