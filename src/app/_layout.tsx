import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/context/AuthContext";
import RootNavigator from "@/navigation/RootNavigator";
import { useTheme } from "@/theme";

export default function RootLayout() {
  const { colors, isDark } = useTheme();
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={colors.backgroundDeep}
        />
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
