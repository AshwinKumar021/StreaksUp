import { useMemo } from "react";
import type { AppColors } from "./colors";
import useTheme from "./useTheme";

export default function useThemedStyles<T>(
  createStyles: (colors: AppColors) => T,
): T {
  const { colors } = useTheme();
  return useMemo(() => createStyles(colors), [colors, createStyles]);
}
