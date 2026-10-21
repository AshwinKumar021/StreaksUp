import { spacing, typography, useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import type { ColorValue } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

type TabIconProps = {
  focused: boolean;
  color: ColorValue;
  size: number;
  name: "home-outline" | "home" | "person-outline" | "person";
};

function TabIcon({ focused, color, size, name }: TabIconProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(focused ? 1.16 : 1, { damping: 12, stiffness: 220 }),
      },
      { translateY: focused ? -2 : 0 },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons color={color} name={name} size={size} />
    </Animated.View>
  );
}

export default function MainTabs() {
  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accentStart,
        tabBarInactiveTintColor: colors.textSubtle,
        tabBarStyle: {
          height: 84,
          paddingTop: spacing.sm,
          paddingBottom: spacing.lg,
          borderTopColor: colors.border,
          backgroundColor: colors.backgroundDeep,
        },
        tabBarLabelStyle: {
          fontFamily: typography.family,
          fontSize: typography.size.caption,
          fontWeight: typography.weight.medium,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              color={color}
              focused={focused}
              name={focused ? "home" : "home-outline"}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon
              color={color}
              focused={focused}
              name={focused ? "person" : "person-outline"}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
