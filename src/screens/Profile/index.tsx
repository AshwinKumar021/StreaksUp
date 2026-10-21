import { AppButton, Avatar, GradientBorderCard } from "@/components";
import { userProfile } from "@/data/user";
import useAuth from "@/hooks/useAuth";
import DetailRow from "@/screens/Profile/components/DetailRow";
import { spacing, typography, useThemedStyles } from "@/theme";
import { useRouter, type Href } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { logout, session } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const name = session?.name ?? userProfile.name;
  const email = session?.email ?? userProfile.email;

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setLogoutError(null);
    try {
      await logout();
      router.replace("/(auth)/login" as Href);
    } catch {
      setLogoutError("We couldn’t sign you out. Please try again.");
      setIsLoggingOut(false);
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(450)}>
          <Text style={styles.title}>Profile</Text>
          <View style={styles.identity}>
            <Avatar name={name} size={88} />
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
          <Text style={styles.sectionTitle}>Your journey</Text>
          <GradientBorderCard contentStyle={styles.details} style={styles.card}>
            <DetailRow
              icon="calendar-outline"
              label="Member since"
              value={session?.memberSince ?? userProfile.memberSince}
            />
            <DetailRow
              icon="trophy-outline"
              label="Longest streak"
              value={`${userProfile.longestStreak} days`}
            />
            <DetailRow
              icon="checkmark-circle-outline"
              label="Total habits"
              value={`${userProfile.totalHabits} habits`}
            />
            <DetailRow
              icon="notifications-outline"
              label="Reminders"
              value={userProfile.reminders}
              last
            />
          </GradientBorderCard>
          {logoutError ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {logoutError}
            </Text>
          ) : null}
          <AppButton
            title="Log Out"
            onPress={() => void handleLogout()}
            variant="outline"
            loading={isLoggingOut}
            disabled={isLoggingOut}
            isLogout={true}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: import("@/theme/colors").AppColors) =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.background },
    content: {
      flexGrow: 1,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.xl,
    },
    title: {
      color: colors.text,
      fontFamily: typography.family,
      fontSize: typography.size.title,
      fontWeight: typography.weight.bold,
    },
    identity: { alignItems: "center", paddingVertical: spacing.xl },
    name: {
      color: colors.text,
      fontFamily: typography.family,
      fontSize: typography.size.subtitle,
      fontWeight: typography.weight.bold,
      marginTop: spacing.md,
    },
    email: {
      color: colors.textMuted,
      fontFamily: typography.family,
      fontSize: typography.size.small,
      marginTop: spacing.xs,
    },
    sectionTitle: {
      color: colors.text,
      fontFamily: typography.family,
      fontSize: typography.size.subtitle,
      fontWeight: typography.weight.bold,
      marginBottom: spacing.md,
    },
    card: { marginBottom: spacing.xl },
    details: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
    error: {
      color: colors.error,
      fontFamily: typography.family,
      fontSize: typography.size.small,
      textAlign: "center",
      marginBottom: spacing.md,
    },
  });
