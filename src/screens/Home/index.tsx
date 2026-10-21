import { Avatar } from "@/components";
import { initialHabits } from "@/data/habits";
import useAuth from "@/hooks/useAuth";
import HabitRow from "@/screens/Home/components/HabitRow";
import ProgressCard from "@/screens/Home/components/ProgressCard";
import StreakCard from "@/screens/Home/components/StreakCard";
import { spacing, typography, useThemedStyles } from "@/theme";
import type { Habit } from "@/types";
import { Href, router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function greetingForHour(hour: number): string {
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  const [habits, setHabits] = useState(initialHabits);
  const completedCount = habits.filter((habit) => habit.completed).length;
  const firstName = session?.name.split(" ")[0] || "there";
  const greeting = greetingForHour(new Date().getHours());

  const toggleHabit = (id: string) => {
    setHabits((current: Habit[]) =>
      current.map((habit) =>
        habit.id === id ? { ...habit, completed: !habit.completed } : habit,
      ),
    );
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.duration(450)}
          style={styles.header}
        >
          <View style={styles.greetingWrap}>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text numberOfLines={1} style={styles.name}>
              {firstName} <Text style={styles.wave}>✦</Text>
            </Text>
          </View>
          <Pressable
            onPress={() => {
              router.push("/profile" as Href);
            }}
            accessibilityLabel="Profile"
          >
            <Avatar name={session?.name ?? "Habit Builder"} size={48} />
          </Pressable>
        </Animated.View>

        <Text style={styles.date}>
          {new Intl.DateTimeFormat(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          }).format(new Date())}
        </Text>

        <StreakCard todayCompleted={completedCount === habits.length} />
        <ProgressCard completed={completedCount} total={habits.length} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today’s habits</Text>
          <Text style={styles.habitCount}>
            {completedCount}/{habits.length} done
          </Text>
        </View>
        {habits.map((habit) => (
          <HabitRow key={habit.id} habit={habit} onToggle={toggleHabit} />
        ))}
        <Text style={styles.encouragement}>
          {completedCount === habits.length
            ? "You’re on fire! Keep it up!"
            : "You can do it! Stay consistent."}
        </Text>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: import("@/theme/colors").AppColors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.xs,
    },
    greetingWrap: { flex: 1, marginRight: spacing.md },
    greeting: {
      color: colors.textMuted,
      fontFamily: typography.family,
      fontSize: typography.size.body,
    },
    name: {
      color: colors.text,
      fontFamily: typography.family,
      fontSize: typography.size.title,
      fontWeight: typography.weight.bold,
      marginTop: spacing.xs,
    },
    wave: { color: colors.accentStart, fontSize: typography.size.body },
    date: {
      color: colors.textSubtle,
      fontFamily: typography.family,
      fontSize: typography.size.small,
      marginBottom: spacing.lg,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.md,
    },
    sectionTitle: {
      color: colors.text,
      fontFamily: typography.family,
      fontSize: typography.size.subtitle,
      fontWeight: typography.weight.bold,
    },
    habitCount: {
      color: colors.textSubtle,
      fontFamily: typography.family,
      fontSize: typography.size.small,
    },
    encouragement: {
      color: colors.textSubtle,
      fontFamily: typography.family,
      fontSize: typography.size.small,
      textAlign: "center",
      marginTop: spacing.sm,
    },
  });
