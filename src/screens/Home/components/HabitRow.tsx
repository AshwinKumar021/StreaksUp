import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GradientBorderCard } from "@/components";
import {
  radius,
  spacing,
  typography,
  useThemedStyles,
  useTheme,
} from "@/theme";
import type { Habit } from "@/types";

type HabitRowProps = {
  habit: Habit;
  onToggle: (id: string) => void;
};

const habitIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  water: "water-outline",
  book: "book-outline",
  fitness: "fitness-outline",
  journal: "journal-outline",
};

export default function HabitRow({ habit, onToggle }: HabitRowProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <GradientBorderCard
      contentStyle={styles.card}
      style={styles.outer}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${habit.color}22` }]}>
        <Ionicons
          color={habit.color}
          name={habitIcons[habit.icon] ?? "ellipse-outline"}
          size={22}
        />
      </View>
      <View style={styles.copy}>
        <Text
          numberOfLines={1}
          style={[styles.name, habit.completed && styles.completedName]}
        >
          {habit.name}
        </Text>
        <Text style={styles.time}>{habit.time}</Text>
      </View>
      <Pressable
        accessibilityLabel={`${habit.completed ? "Mark incomplete" : "Mark complete"}: ${habit.name}`}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: habit.completed }}
        hitSlop={spacing.sm}
        onPress={() => onToggle(habit.id)}
        style={[
          styles.checkbox,
          habit.completed && {
            borderColor: colors.accentStart,
            backgroundColor: colors.accentStart,
          },
        ]}
      >
        {habit.completed ? (
          <Ionicons color={colors.backgroundDeep} name="checkmark" size={17} />
        ) : null}
      </Pressable>
    </GradientBorderCard>
  );
}

const createStyles = (colors: import("@/theme/colors").AppColors) => StyleSheet.create({
  outer: { marginBottom: spacing.md },
  card: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
  },
  copy: { flex: 1, gap: spacing.xs },
  name: {
    color: colors.text,
    fontFamily: typography.family,
    fontSize: typography.size.small,
    fontWeight: typography.weight.semibold,
  },
  completedName: { color: colors.textMuted },
  time: {
    color: colors.textSubtle,
    fontFamily: typography.family,
    fontSize: typography.size.caption,
  },
  checkbox: {
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
  },
});
