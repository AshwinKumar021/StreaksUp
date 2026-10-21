import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { spacing, typography, useThemedStyles, useTheme } from "@/theme";

type DetailRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
};

export default function DetailRow({
  icon,
  label,
  value,
  last = false,
}: DetailRowProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.row, !last && styles.divider]}>
      <View style={styles.iconWrap}>
        <Ionicons color={colors.accentStart} name={icon} size={20} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text numberOfLines={1} style={styles.value}>
        {value}
      </Text>
    </View>
  );
}

const createStyles = (colors: import("@/theme/colors").AppColors) => StyleSheet.create({
  row: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  iconWrap: { width: 28, alignItems: "center" },
  label: {
    flex: 1,
    color: colors.textMuted,
    fontFamily: typography.family,
    fontSize: typography.size.small,
  },
  value: {
    maxWidth: "46%",
    color: colors.text,
    fontFamily: typography.family,
    fontSize: typography.size.small,
    fontWeight: typography.weight.medium,
    textAlign: "right",
  },
});
