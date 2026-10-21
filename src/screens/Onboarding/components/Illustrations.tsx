import {
  radius,
  spacing,
  typography,
  useTheme,
  useThemedStyles,
} from "@/theme";
import type { OnboardingSlide } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type IllustrationProps = {
  type: OnboardingSlide["illustration"];
};

const habitLabels = ["Morning water", "Read a little", "Move your body"];

export default function Illustration({ type }: IllustrationProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const primaryMotion = useSharedValue(0);
  const secondaryMotion = useSharedValue(0);

  useEffect(() => {
    primaryMotion.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1050 }),
        withTiming(0, { duration: 1050 }),
      ),
      -1,
    );
    secondaryMotion.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 780 }),
        withTiming(0, { duration: 780 }),
      ),
      -1,
    );
    return () => {
      cancelAnimation(primaryMotion);
      cancelAnimation(secondaryMotion);
    };
  }, [primaryMotion, secondaryMotion]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: primaryMotion.value * -9 }],
  }));
  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.92 + secondaryMotion.value * 0.12 }],
  }));
  const fillStyle = useAnimatedStyle(() => ({
    width: `${38 + primaryMotion.value * 54}%` as `${number}%`,
  }));
  const firstCheckStyle = useAnimatedStyle(() => ({
    opacity: primaryMotion.value,
    transform: [{ scale: 0.75 + primaryMotion.value * 0.25 }],
  }));
  const secondCheckStyle = useAnimatedStyle(() => ({
    opacity: secondaryMotion.value,
    transform: [{ scale: 0.75 + secondaryMotion.value * 0.25 }],
  }));
  const progress = 1 - primaryMotion.value * 0.12;

  if (type === "habits") {
    return (
      <>
        <View style={styles.container}>
          <View style={styles.animationCircle}>
            <LottieView
              source={require("@/assets/images/jumping_jack_gif.json")}
              autoPlay
              loop
              style={{ width: 250, height: 250 }}
              resizeMode="contain"
            />
          </View>
        </View>
        {/* <View style={styles.habitsWrap}>
          {habitLabels.map((label, index) => (
            <View key={label} style={styles.habitRow}>
              <View style={styles.checkCircle}>
                {index === 0 ? (
                  <Ionicons color={colors.success} name="checkmark" size={18} />
                ) : (
                  <Animated.View
                    style={index === 1 ? firstCheckStyle : secondCheckStyle}
                  >
                    <Ionicons
                      color={colors.accentStart}
                      name="checkmark"
                      size={18}
                    />
                  </Animated.View>
                )}
              </View>
              <Text style={styles.habitLabel}>{label}</Text>
              <Ionicons
                color={colors.textSubtle}
                name="ellipsis-horizontal"
                size={18}
              />
            </View>
          ))}
        </View> */}
      </>
    );
  }

  if (type === "streak") {
    return (
      <View style={styles.centered}>
        <Animated.View style={[styles.flameHalo, floatStyle]}>
          <Animated.View style={bounceStyle}>
            <Ionicons color={colors.accentStart} name="flame" size={112} />
          </Animated.View>
          <View style={styles.streakBadge}>
            <Text style={styles.streakCount}>7</Text>
            <Text style={styles.streakCaption}>DAY STREAK</Text>
          </View>
        </Animated.View>
      </View>
    );
  }

  if (type === "progress") {
    return (
      <View style={styles.centered}>
        <View style={styles.progressCard}>
          <View style={styles.progressHeading}>
            <Text style={styles.progressTitle}>Your progress</Text>
            <Ionicons color={colors.accentStart} name="trending-up" size={21} />
          </View>
          {[0, 1, 2].map((bar, index) => (
            <View key={bar} style={styles.progressRow}>
              <Text style={styles.progressDay}>
                {["MON", "TUE", "WED"][index]}
              </Text>
              <View style={styles.track}>
                <Animated.View style={[styles.fill, fillStyle]} />
              </View>
            </View>
          ))}
          <View style={styles.ringWrap}>
            <Svg height={112} width={112} viewBox="0 0 112 112">
              <Circle
                cx="56"
                cy="56"
                r="46"
                fill="none"
                stroke={colors.surfaceRaised}
                strokeWidth="9"
              />
              <AnimatedCircle
                cx="56"
                cy="56"
                r="46"
                fill="none"
                stroke={colors.accentStart}
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={289}
                strokeDashoffset={289 * (1 - progress)}
                rotation="-90"
                origin="56, 56"
              />
            </Svg>
            <Text style={styles.ringLabel}>82%</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.centered}>
      <Animated.View style={[styles.trophyHalo, bounceStyle]}>
        <Ionicons color={colors.warning} name="trophy" size={92} />
      </Animated.View>
      <Animated.View style={[styles.sparkleOne, floatStyle]}>
        <Ionicons color={colors.accentEnd} name="sparkles" size={26} />
      </Animated.View>
      <Animated.View style={[styles.sparkleTwo, bounceStyle]}>
        <Ionicons color={colors.accentStart} name="star" size={22} />
      </Animated.View>
    </View>
  );
}

const createStyles = (colors: import("@/theme/colors").AppColors) =>
  StyleSheet.create({
    container: {
      marginTop: spacing.xl,
      alignItems: "center",
      justifyContent: "center",
    },

    animationCircle: {
      backgroundColor: "#F7F1FC",
      width: 280,
      height: 280,
      borderRadius: 140,
      borderWidth: 2,
      borderColor: "#f66701",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    centered: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    },
    habitsWrap: {
      width: "100%",
      justifyContent: "center",
      gap: spacing.md,
      paddingHorizontal: spacing.sm,
    },
    habitRow: {
      minHeight: 62,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
    },
    checkCircle: {
      width: 30,
      height: 30,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.pill,
      backgroundColor: colors.surfaceRaised,
    },
    habitLabel: {
      flex: 1,
      color: colors.text,
      fontFamily: typography.family,
      fontSize: typography.size.small,
      fontWeight: typography.weight.medium,
    },
    flameHalo: {
      width: 228,
      height: 228,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 114,
      backgroundColor: colors.surfaceRaised,
    },
    streakBadge: {
      position: "absolute",
      right: -spacing.sm,
      bottom: spacing.md,
      alignItems: "center",
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    streakCount: {
      color: colors.text,
      fontFamily: typography.family,
      fontSize: typography.size.title,
      fontWeight: typography.weight.bold,
    },
    streakCaption: {
      color: colors.textMuted,
      fontFamily: typography.family,
      fontSize: typography.size.caption,
      fontWeight: typography.weight.semibold,
      letterSpacing: 0.5,
    },
    progressCard: {
      width: "100%",
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      padding: spacing.lg,
    },
    progressHeading: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.md,
    },
    progressTitle: {
      color: colors.text,
      fontFamily: typography.family,
      fontSize: typography.size.body,
      fontWeight: typography.weight.semibold,
    },
    progressRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      marginTop: spacing.sm,
    },
    progressDay: {
      width: 30,
      color: colors.textSubtle,
      fontFamily: typography.family,
      fontSize: typography.size.caption,
      fontWeight: typography.weight.semibold,
    },
    track: {
      flex: 1,
      height: 8,
      borderRadius: radius.pill,
      backgroundColor: colors.surfaceRaised,
      overflow: "hidden",
    },
    fill: {
      height: "100%",
      borderRadius: radius.pill,
      backgroundColor: colors.accentStart,
    },
    ringWrap: {
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      marginTop: spacing.md,
    },
    ringLabel: {
      position: "absolute",
      color: colors.text,
      fontFamily: typography.family,
      fontSize: typography.size.title,
      fontWeight: typography.weight.bold,
    },
    trophyHalo: {
      width: 204,
      height: 204,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 102,
      backgroundColor: colors.surfaceRaised,
    },
    sparkleOne: { position: "absolute", top: 26, right: 32 },
    sparkleTwo: { position: "absolute", bottom: 60, left: 32 },
  });
