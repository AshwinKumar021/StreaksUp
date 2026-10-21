import { useColorScheme } from "react-native";
import darkColors, { lightColors } from "./colors";

export default function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme !== "light";

  return {
    colors: isDark ? darkColors : lightColors,
    isDark,
  };
}
