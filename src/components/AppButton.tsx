import {
  radius,
  spacing,
  typography,
  useTheme,
  useThemedStyles,
} from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import type { PropsWithChildren } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

type AppButtonProps = PropsWithChildren<{
  title: string;
  onPress: () => void;
  variant?: "primary" | "outline";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  isLogout?: boolean;
}>;

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  icon,
  style,
  isLogout = false,
}: AppButtonProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const isDisabled = disabled || loading;
  const content = (
    <View style={styles.row}>
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <>
          {icon}
          <Text
            style={
              isLogout
                ? [styles.label, { color: colors.logoutBtnClr }]
                : styles.label
            }
          >
            {title}
          </Text>
        </>
      )}
    </View>
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={[styles.pressable, style, isDisabled && styles.disabled]}
    >
      {variant === "primary" ? (
        <LinearGradient
          colors={[colors.accentStart, colors.accentEnd]}
          style={styles.button}
        >
          {content}
        </LinearGradient>
      ) : (
        <View style={[styles.button, styles.outline]}>{content}</View>
      )}
    </Pressable>
  );
}

const createStyles = (colors: import("@/theme/colors").AppColors) =>
  StyleSheet.create({
    pressable: { borderRadius: radius.pill, overflow: "hidden" },
    button: {
      minHeight: 56,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.lg,
    },
    outline: {
      borderWidth: 1,
      borderRadius: radius.pill,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
    label: {
      color: colors.buttonClr,
      fontFamily: typography.family,
      fontSize: typography.size.body,
      fontWeight: typography.weight.bold,
    },
    disabled: { opacity: 0.55 },
  });
