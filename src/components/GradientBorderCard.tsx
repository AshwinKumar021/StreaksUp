import type { PropsWithChildren } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { radius, spacing, useThemedStyles, useTheme } from "@/theme";

type GradientBorderCardProps = PropsWithChildren<{
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  accent?: boolean;
}>;

export default function GradientBorderCard({
  children,
  style,
  contentStyle,
  accent = false,
}: GradientBorderCardProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <LinearGradient
      colors={
        accent
          ? [colors.accentStart, colors.accentEnd]
          : [colors.border, colors.surfaceRaised]
      }
      style={[styles.border, style]}
    >
      <View style={[styles.content, contentStyle]}>{children}</View>
    </LinearGradient>
  );
}

const createStyles = (colors: import("@/theme/colors").AppColors) => StyleSheet.create({
  border: { borderRadius: radius.lg, padding: 1 },
  content: {
    borderRadius: radius.lg - 1,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
});
