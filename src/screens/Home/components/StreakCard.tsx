import FlameIcon from "@/components/FlameIcon";
import {
  radius,
  spacing,
  typography,
  useTheme,
  useThemedStyles,
} from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type StreakCardProps = {
  todayCompleted: boolean;
};
const weekLabels = ["M", "T", "W", "T", "F", "S", "S"];

export default function StreakCard({ todayCompleted }: StreakCardProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const today = (new Date().getDay() + 6) % 7;

  const weeklyActivity = Array.from({ length: 7 }, (_, index) =>
    index < today ? true : index === today ? todayCompleted : false,
  );
  const [showTrophy, setShowTrophy] = useState(false);

  useEffect(() => {
    if (!todayCompleted) {
      setShowTrophy(false);
      return;
    }

    setShowTrophy(true);

    const timer = setTimeout(() => {
      setShowTrophy(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [todayCompleted]);

  return (
    <LinearGradient
      colors={[colors.surfaceRaised, colors.surface]}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={styles.streakInfo}>
          <View style={styles.flame}>
            <FlameIcon colors={colors} />
          </View>
          <View>
            <Text style={styles.label}>CURRENT STREAK</Text>
            <Text style={styles.current}>
              7 <Text style={styles.days}>days</Text>
            </Text>
          </View>
        </View>
        <View style={styles.best}>
          <Ionicons color={colors.warning} name="trophy-outline" size={17} />
          <Text style={styles.bestText}>Best 18 days</Text>
        </View>
      </View>
      <View style={styles.week}>
        {weeklyActivity.map((active, index) => {
          const isToday = index === today;

          return (
            <View key={`${weekLabels[index]}-${index}`} style={styles.day}>
              <View style={[styles.dot, active && styles.activeDot]}>
                {active ? (
                  isToday && showTrophy ? (
                    <Ionicons
                      color={colors.backgroundDeep}
                      name="trophy"
                      size={14}
                    />
                  ) : (
                    <Ionicons
                      color={colors.backgroundDeep}
                      name="checkmark"
                      size={12}
                    />
                  )
                ) : null}
              </View>

              <Text style={styles.weekLabel}>{weekLabels[index]}</Text>
            </View>
          );
        })}
      </View>
    </LinearGradient>
  );
}

const createStyles = (colors: import("@/theme/colors").AppColors) =>
  StyleSheet.create({
    card: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
    },
    topRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    streakInfo: { flexDirection: "row", alignItems: "center", gap: spacing.md },
    flame: {
      width: 48,
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: radius.md,
      backgroundColor: colors.background,
    },
    label: {
      color: colors.textSubtle,
      fontFamily: typography.family,
      fontSize: typography.size.caption,
      fontWeight: typography.weight.semibold,
      letterSpacing: 0.7,
    },
    current: {
      color: colors.text,
      fontFamily: typography.family,
      fontSize: typography.size.title,
      fontWeight: typography.weight.bold,
      marginTop: spacing.xs,
    },
    days: {
      color: colors.textMuted,
      fontSize: typography.size.small,
      fontWeight: typography.weight.regular,
    },
    best: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      borderRadius: radius.pill,
      backgroundColor: colors.background,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    bestText: {
      color: colors.textMuted,
      fontFamily: typography.family,
      fontSize: typography.size.caption,
      fontWeight: typography.weight.medium,
    },
    week: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: spacing.lg,
    },
    day: { alignItems: "center", gap: spacing.xs },
    dot: {
      width: 25,
      height: 25,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.pill,
      backgroundColor: colors.background,
    },
    activeDot: {
      borderColor: colors.accentStart,
      backgroundColor: colors.accentStart,
    },
    weekLabel: {
      color: colors.textSubtle,
      fontFamily: typography.family,
      fontSize: typography.size.caption,
    },
  });
