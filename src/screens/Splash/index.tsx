import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useRouter, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppButton, GradientBackground } from "@/components";
import useAuth from "@/hooks/useAuth";
import { spacing, typography, useThemedStyles, useTheme } from "@/theme";
import {
  SPLASH_DURATION_MS,
  SPLASH_FADE_MS,
  SPLASH_PULSE_MS,
} from "@/utils/constants";

export default function SplashScreen() {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    initialized,
    initializationError,
    onboardingSeen,
    retryInitialization,
    session,
  } = useAuth();
  const [minimumTimeElapsed, setMinimumTimeElapsed] = useState(false);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.82);
  const flameScale = useSharedValue(1);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: SPLASH_FADE_MS });
    logoScale.value = withTiming(1, { duration: SPLASH_FADE_MS });
    flameScale.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: SPLASH_PULSE_MS }),
        withTiming(1, { duration: SPLASH_PULSE_MS }),
      ),
      -1,
    );

    const timer = setTimeout(() => {
      setMinimumTimeElapsed(true);
    }, SPLASH_DURATION_MS);

    return () => {
      clearTimeout(timer);
      cancelAnimation(flameScale);
    };
  }, [flameScale, logoOpacity, logoScale]);

  useEffect(() => {
    if (!initialized || !minimumTimeElapsed || initializationError) return;

    const destination = session
      ? "/(tabs)"
      : onboardingSeen
        ? "/(auth)/login"
        : "/(auth)/onboarding";
    router.replace(destination as Href);
  }, [
    initializationError,
    initialized,
    minimumTimeElapsed,
    onboardingSeen,
    router,
    session,
  ]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));
  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
  }));

  return (
    <GradientBackground>
      <View
        style={[
          styles.content,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <Animated.View style={[styles.logo, logoStyle]}>
          <View style={styles.mark}>
            <Animated.View style={flameStyle}>
              <Ionicons color={colors.accentStart} name="flame" size={50} />
            </Animated.View>
          </View>
          <Text style={styles.title}>Streaks</Text>
          <Text style={styles.subtitle}>Little habits. Lasting change.</Text>
        </Animated.View>
        {initializationError ? (
          <View style={styles.errorPanel}>
            <Text accessibilityRole="alert" style={styles.errorText}>
              {initializationError}
            </Text>
            <AppButton title="Try again" onPress={retryInitialization} />
          </View>
        ) : null}
      </View>
    </GradientBackground>
  );
}

const createStyles = (colors: import("@/theme/colors").AppColors) => StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  logo: { alignItems: "center" },
  mark: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    backgroundColor: colors.surfaceRaised,
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.text,
    fontFamily: typography.family,
    fontSize: typography.size.hero,
    fontWeight: typography.weight.bold,
    letterSpacing: 0.5,
  },
  subtitle: {
    color: colors.textMuted,
    fontFamily: typography.family,
    fontSize: typography.size.body,
    marginTop: spacing.sm,
  },
  errorPanel: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.xl,
    left: spacing.lg,
    gap: spacing.md,
  },
  errorText: {
    color: colors.error,
    fontFamily: typography.family,
    fontSize: typography.size.small,
    textAlign: "center",
  },
});
