import {
  AppButton,
  AppInput,
  GradientBackground,
  GradientBorderCard,
} from "@/components";
import useAuth from "@/hooks/useAuth";
import useFormValidation from "@/hooks/useFormValidation";
import {
  radius,
  spacing,
  typography,
  useTheme,
  useThemedStyles,
} from "@/theme";
import { validateEmail, validatePassword } from "@/utils/validators";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Href } from "expo-router";
import { useCallback, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type LoginValues = {
  email: string;
  password: string;
};

const initialValues: LoginValues = { email: "", password: "" };

function validate(values: LoginValues) {
  return {
    email: validateEmail(values.email),
    password: validatePassword(values.password),
  };
}

export default function LoginScreen() {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const { values, errors, setValue, validateForm } = useFormValidation(
    initialValues,
    validate,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const submit = useCallback(async () => {
    if (isLoading || !validateForm()) return;
    setIsLoading(true);
    setAuthError(null);
    try {
      await login(values.email, values.password);
      router.replace("/(tabs)" as Href);
    } catch {
      setAuthError("We couldn’t sign you in. Please try again.");
      setIsLoading(false);
    }
  }, [isLoading, login, router, validateForm, values.email, values.password]);

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboard}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + spacing.xl,
              paddingBottom: insets.bottom + spacing.lg,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            entering={FadeInDown.duration(500)}
            style={styles.content}
          >
            <View style={styles.brandMark}>
              <Ionicons color={colors.accentStart} name="flame" size={36} />
            </View>
            <Text style={styles.eyebrow}>WELCOME BACK</Text>
            <Text style={styles.title}>
              Make today{"\u2019"}s habits count.
            </Text>
            <Text style={styles.subtitle}>
              Sign in and keep your streak moving.
            </Text>

            <GradientBorderCard
              contentStyle={styles.formCard}
              style={styles.card}
            >
              <AppInput
                autoComplete="email"
                keyboardType="email-address"
                label="Email address"
                onChangeText={(value) => setValue("email", value)}
                placeholder="you@example.com"
                returnKeyType="next"
                textContentType="emailAddress"
                value={values.email}
                error={errors.email}
                icon={
                  <Ionicons
                    color={colors.textSubtle}
                    name="mail-outline"
                    size={20}
                  />
                }
              />
              <AppInput
                autoComplete="current-password"
                label="Password"
                onChangeText={(value) => setValue("password", value)}
                placeholder="At least 6 characters"
                returnKeyType="done"
                secureTextEntry
                secureToggle
                textContentType="password"
                value={values.password}
                error={errors.password}
                icon={
                  <Ionicons
                    color={colors.textSubtle}
                    name="lock-closed-outline"
                    size={20}
                  />
                }
                onSubmitEditing={() => void submit()}
              />
              {authError ? (
                <Text accessibilityRole="alert" style={styles.authError}>
                  {authError}
                </Text>
              ) : null}
              <AppButton
                title="Sign In"
                onPress={() => void submit()}
                loading={isLoading}
                disabled={isLoading}
                style={styles.submit}
              />
              <Text style={styles.finePrint}>
                Enter valid email and password with 6 or more characters will
                work.
              </Text>
            </GradientBorderCard>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.replace("/(auth)/onboarding" as Href)}
              style={styles.onboardingLink}
            >
              <Text style={styles.linkText}>New here? </Text>
              <Text style={styles.linkAccent}>See how Streaks works</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const createStyles = (colors: import("@/theme/colors").AppColors) =>
  StyleSheet.create({
    keyboard: { flex: 1 },
    scrollContent: { flexGrow: 1, justifyContent: "center" },
    content: { paddingHorizontal: spacing.lg },
    brandMark: {
      width: 68,
      height: 68,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: radius.lg,
      backgroundColor: colors.surfaceRaised,
      marginBottom: spacing.xl,
    },
    eyebrow: {
      color: colors.accentStart,
      fontFamily: typography.family,
      fontSize: typography.size.caption,
      fontWeight: typography.weight.bold,
      letterSpacing: 1.5,
      marginBottom: spacing.sm,
    },
    title: {
      maxWidth: 330,
      color: colors.text,
      fontFamily: typography.family,
      fontSize: typography.size.display,
      fontWeight: typography.weight.bold,
      lineHeight: 40,
    },
    subtitle: {
      color: colors.textMuted,
      fontFamily: typography.family,
      fontSize: typography.size.body,
      marginTop: spacing.md,
      marginBottom: spacing.xl,
    },
    card: { marginTop: spacing.sm },
    formCard: { gap: spacing.lg, padding: spacing.lg },
    authError: {
      color: colors.error,
      fontFamily: typography.family,
      fontSize: typography.size.small,
    },
    submit: { marginTop: spacing.sm },
    finePrint: {
      color: colors.textSubtle,
      fontFamily: typography.family,
      fontSize: typography.size.caption,
      lineHeight: 18,
      textAlign: "center",
    },
    onboardingLink: {
      flexDirection: "row",
      alignSelf: "center",
      justifyContent: "center",
      marginTop: spacing.xl,
      paddingVertical: spacing.sm,
    },
    linkText: {
      color: colors.textMuted,
      fontFamily: typography.family,
      fontSize: typography.size.small,
    },
    linkAccent: {
      color: colors.accentStart,
      fontFamily: typography.family,
      fontSize: typography.size.small,
      fontWeight: typography.weight.semibold,
    },
  });
