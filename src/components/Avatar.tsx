import { radius, typography, useTheme, useThemedStyles } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

type AvatarProps = {
  name: string;
  size?: number;
};

export default function Avatar({ name, size = 72 }: AvatarProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <LinearGradient
      colors={[colors.accentStart, colors.accentEnd]}
      style={[
        styles.gradient,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <View style={styles.inner}>
        <Text style={[styles.initials, { fontSize: size / 3.2 }]}>
          {initials || "U"}
        </Text>
      </View>
    </LinearGradient>
  );
}

const createStyles = (colors: import("@/theme/colors").AppColors) =>
  StyleSheet.create({
    gradient: { alignItems: "center", justifyContent: "center" },
    inner: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: radius.pill,
      backgroundColor: colors.transparent,
    },
    initials: {
      color: colors.white,
      fontFamily: typography.family,
      fontWeight: typography.weight.bold,
    },
  });
