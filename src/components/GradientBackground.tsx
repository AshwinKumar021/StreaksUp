import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useThemedStyles, useTheme } from "@/theme";

type GradientBackgroundProps = PropsWithChildren<{
  style?: object;
}>;

export default function GradientBackground({
  children,
  style,
}: GradientBackgroundProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <LinearGradient
      colors={[colors.backgroundDeep, colors.background, colors.surface]}
      locations={[0, 0.58, 1]}
      style={[styles.container, style]}
    >
      <View pointerEvents="none" style={styles.glow} />
      {children}
    </LinearGradient>
  );
}

const createStyles = (colors: import("@/theme/colors").AppColors) => StyleSheet.create({
  container: { flex: 1, overflow: "hidden" },
  glow: {
    position: "absolute",
    top: -160,
    right: -120,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: colors.accent,
    opacity: 0.08,
  },
});
