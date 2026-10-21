import { GradientBorderCard } from "@/components";
import {
  radius,
  spacing,
  typography,
  useTheme,
  useThemedStyles,
} from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type ProgressCardProps = {
  completed: number;
  total: number;
};

export default function ProgressCard({ completed, total }: ProgressCardProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const allHabitsComplete = total > 0 && completed >= total;
  const progress = allHabitsComplete
    ? 100
    : total > 0
      ? Math.min(Math.round((completed / total) * 100), 99)
      : 0;
  const progressValue = useSharedValue(0);

  useEffect(() => {
    progressValue.value = withTiming(progress, { duration: 450 });
    return () => cancelAnimation(progressValue);
  }, [progress, progressValue]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value}%`,
  }));

  return (
    <GradientBorderCard contentStyle={styles.card} style={styles.outer}>
      <View style={styles.heading}>
        <View>
          <Text style={styles.title}>Today’s progress</Text>
          <Text style={styles.caption}>
            {completed} of {total} habits complete
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {allHabitsComplete ? (
            <>
              <Text style={styles.percentage}>{progress}%</Text>
              <Ionicons color={colors.warning} name="trophy" size={25} />
            </>
          ) : (
            <Text style={styles.percentage}>{progress}%</Text>
          )}
        </View>
      </View>
      <View
        accessibilityLabel={`Today's habits ${progress}% complete`}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: progress }}
        style={styles.track}
      >
        <Animated.View style={[styles.fill, barStyle]} />
      </View>
    </GradientBorderCard>
  );
}

const createStyles = (colors: import("@/theme/colors").AppColors) =>
  StyleSheet.create({
    outer: { marginBottom: spacing.lg },
    card: { gap: spacing.lg },
    heading: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      color: colors.text,
      fontFamily: typography.family,
      fontSize: typography.size.body,
      fontWeight: typography.weight.semibold,
    },
    caption: {
      color: colors.textMuted,
      fontFamily: typography.family,
      fontSize: typography.size.caption,
      marginTop: spacing.xs,
    },
    percentage: {
      color: colors.accentStart,
      fontFamily: typography.family,
      fontSize: typography.size.title,
      fontWeight: typography.weight.bold,
    },
    track: {
      height: 10,
      borderRadius: radius.pill,
      backgroundColor: colors.surfaceRaised,
      overflow: "hidden",
    },
    fill: {
      height: "100%",
      borderRadius: radius.pill,
      backgroundColor: colors.accentStart,
    },
    celebration: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      borderWidth: 1,
      borderColor: colors.accentStart,
      borderRadius: radius.md,
      backgroundColor: colors.backgroundDeep,
      padding: spacing.md,
    },
    celebrationIcons: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    celebrationCopy: { flex: 1, gap: spacing.xs },
    celebrationTitle: {
      color: colors.text,
      fontFamily: typography.family,
      fontSize: typography.size.small,
      fontWeight: typography.weight.bold,
    },
    celebrationMessage: {
      color: colors.textMuted,
      fontFamily: typography.family,
      fontSize: typography.size.caption,
      lineHeight: 18,
    },
  });
