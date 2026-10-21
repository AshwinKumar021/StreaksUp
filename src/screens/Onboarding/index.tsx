import { AppButton, GradientBackground } from "@/components";
import { onboardingSlides } from "@/data/onboarding";
import useAuth from "@/hooks/useAuth";
import Illustration from "@/screens/Onboarding/components/Illustrations";
import {
  radius,
  spacing,
  typography,
  useTheme,
  useThemedStyles,
} from "@/theme";
import type { OnboardingSlide } from "@/types";
import { useRouter, type Href } from "expo-router";
import { useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  type SharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function PageDot({
  index,
  currentPage,
}: {
  index: number;
  currentPage: SharedValue<number>;
}) {
  const { colors } = useTheme();
  const animatedStyle = useAnimatedStyle(() => ({
    width: withSpring(currentPage.value === index ? 28 : 8, {
      damping: 16,
      stiffness: 180,
    }),
    backgroundColor:
      currentPage.value === index ? colors.accentStart : colors.border,
  }));

  return (
    <Animated.View
      accessibilityLabel={`Page ${index + 1}`}
      style={[dotStyles.dot, animatedStyle]}
    />
  );
}

const dotStyles = StyleSheet.create({
  dot: { height: 8, borderRadius: radius.pill },
});

function OnboardingPage({
  item,
  index,
  windowWidth,
  scrollX,
}: {
  item: OnboardingSlide;
  index: number;
  windowWidth: number;
  scrollX: SharedValue<number>;
}) {
  const styles = useThemedStyles(createStyles);
  const illustrationStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * windowWidth,
      index * windowWidth,
      (index + 1) * windowWidth,
    ];
    return {
      opacity: interpolate(
        scrollX.value,
        inputRange,
        [0.45, 1, 0.45],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          scale: interpolate(
            scrollX.value,
            inputRange,
            [0.86, 1, 0.86],
            Extrapolation.CLAMP,
          ),
        },
        {
          translateY: interpolate(
            scrollX.value,
            inputRange,
            [24, 0, -24],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <View style={[styles.slide, { width: windowWidth }]}>
      <Animated.View style={[styles.illustration, illustrationStyle]}>
        <Illustration type={item.illustration} />
      </Animated.View>
      <View style={styles.copy}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
}

export default function OnboardingScreen() {
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const { completeOnboarding } = useAuth();
  const listRef = useRef<FlatList<OnboardingSlide>>(null);
  const [page, setPage] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const scrollX = useSharedValue(0);
  const currentPage = useSharedValue(0);
  const lastPage = onboardingSlides.length - 1;

  const onMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const nextPage = Math.round(
      event.nativeEvent.contentOffset.x / windowWidth,
    );
    setPage(nextPage);
    currentPage.value = nextPage;
  };

  const finishOnboarding = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await completeOnboarding();
      router.replace("/(auth)/login" as Href);
    } catch {
      setSaveError("We couldn’t save your progress. Please try again.");
      setIsSaving(false);
    }
  };

  const goToNext = () => {
    if (page === lastPage) {
      void finishOnboarding();
      return;
    }
    listRef.current?.scrollToIndex({ index: page + 1, animated: true });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
  };

  return (
    <GradientBackground>
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + spacing.md,
            paddingBottom: Math.max(insets.bottom, spacing.md) + spacing.sm,
          },
        ]}
      >
        <View style={styles.topRow}>
          <Text style={styles.brand}>Streaks</Text>
          {page < lastPage ? (
            <Pressable
              accessibilityRole="button"
              disabled={isSaving}
              hitSlop={spacing.md}
              onPress={() => void finishOnboarding()}
            >
              <Text style={styles.skip}>Skip</Text>
            </Pressable>
          ) : (
            <View style={styles.skipPlaceholder} />
          )}
        </View>
        <FlatList
          ref={listRef}
          data={onboardingSlides}
          extraData={windowWidth}
          horizontal={true}
          keyExtractor={(item) => item.id}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScroll={handleScroll}
          pagingEnabled={true}
          style={styles.pager}
          renderItem={({ item, index }) => (
            <OnboardingPage
              index={index}
              item={item}
              scrollX={scrollX}
              windowWidth={windowWidth}
            />
          )}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          viewabilityConfig={{ itemVisiblePercentThreshold: 55 }}
        />
        <View style={styles.footer}>
          <View accessibilityRole="adjustable" style={styles.dots}>
            {onboardingSlides.map((slide, index) => (
              <PageDot key={slide.id} currentPage={currentPage} index={index} />
            ))}
          </View>
          {saveError ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {saveError}
            </Text>
          ) : null}
          <AppButton
            title={page === lastPage ? "Get Started" : "Next"}
            onPress={goToNext}
            loading={isSaving}
            disabled={isSaving}
          />
        </View>
      </View>
    </GradientBackground>
  );
}

const createStyles = (colors: import("@/theme/colors").AppColors) =>
  StyleSheet.create({
    container: { flex: 1 },
    topRow: {
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.lg,
    },
    brand: {
      color: colors.text,
      fontFamily: typography.family,
      fontSize: typography.size.subtitle,
      fontWeight: typography.weight.bold,
    },
    skip: {
      color: colors.textMuted,
      fontFamily: typography.family,
      fontSize: typography.size.body,
      fontWeight: typography.weight.medium,
    },
    skipPlaceholder: { width: 30 },
    pager: { flex: 1 },
    slide: { flex: 1, alignItems: "center", paddingHorizontal: spacing.lg },
    illustration: { flex: 0.62, width: "100%", maxWidth: 380 },
    copy: { flex: 0.38, alignItems: "center", paddingTop: spacing.lg },
    title: {
      color: colors.text,
      fontFamily: typography.family,
      fontSize: typography.size.title,
      fontWeight: typography.weight.bold,
      textAlign: "center",
    },
    description: {
      maxWidth: 310,
      color: colors.textMuted,
      fontFamily: typography.family,
      fontSize: typography.size.body,
      lineHeight: 24,
      marginTop: spacing.md,
      textAlign: "center",
    },
    footer: { gap: spacing.lg, paddingHorizontal: spacing.lg },
    dots: {
      minHeight: spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
    },
    error: {
      color: colors.error,
      fontFamily: typography.family,
      fontSize: typography.size.small,
      textAlign: "center",
    },
  });
