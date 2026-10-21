import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { radius, spacing, typography, useThemedStyles, useTheme } from "@/theme";

type AppInputProps = TextInputProps & {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  secureToggle?: boolean;
};

export default function AppInput({
  label,
  error,
  icon,
  secureToggle = false,
  secureTextEntry,
  ...inputProps
}: AppInputProps) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const shouldHide = secureToggle && secureTextEntry && !isPasswordVisible;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {icon}
        <TextInput
          accessibilityLabel={label}
          autoCapitalize="none"
          placeholderTextColor={colors.textSubtle}
          selectionColor={colors.accent}
          secureTextEntry={shouldHide}
          style={styles.input}
          {...inputProps}
        />
        {secureToggle ? (
          <Pressable
            accessibilityLabel={isPasswordVisible ? "Hide password" : "Show password"}
            accessibilityRole="button"
            hitSlop={spacing.sm}
            onPress={() => setIsPasswordVisible((visible) => !visible)}
          >
            <Text style={styles.toggle}>
              {isPasswordVisible ? "Hide" : "Show"}
            </Text>
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const createStyles = (colors: import("@/theme/colors").AppColors) => StyleSheet.create({
  wrapper: { gap: spacing.sm },
  label: {
    color: colors.textMuted,
    fontFamily: typography.family,
    fontSize: typography.size.small,
    fontWeight: typography.weight.medium,
  },
  inputContainer: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.base,
  },
  inputError: { borderColor: colors.error },
  input: {
    flex: 1,
    color: colors.text,
    fontFamily: typography.family,
    fontSize: typography.size.body,
    paddingVertical: spacing.base,
  },
  toggle: {
    color: colors.accentStart,
    fontFamily: typography.family,
    fontSize: typography.size.small,
    fontWeight: typography.weight.semibold,
  },
  error: {
    color: colors.error,
    fontFamily: typography.family,
    fontSize: typography.size.caption,
  },
});
