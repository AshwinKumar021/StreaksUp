import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import type { AuthSession } from "@/types";
import {
  clearSession,
  getOnboardingSeen,
  getSession,
  saveOnboardingSeen,
} from "@/services/storage";
import { signIn } from "@/services/authService";

type AuthContextValue = {
  session: AuthSession | null;
  onboardingSeen: boolean;
  initialized: boolean;
  initializationError: string | null;
  completeOnboarding: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  retryInitialization: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [onboardingSeen, setOnboardingSeen] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [initializationError, setInitializationError] = useState<string | null>(
    null,
  );
  const [initializationAttempt, setInitializationAttempt] = useState(0);

  useEffect(() => {
    let isActive = true;

    async function initialize() {
      try {
        const [savedSession, hasSeenOnboarding] = await Promise.all([
          getSession(),
          getOnboardingSeen(),
        ]);
        if (!isActive) return;
        setSession(savedSession);
        setOnboardingSeen(hasSeenOnboarding);
        setInitializationError(null);
      } catch (error) {
        if (!isActive) return;
        setInitializationError(
          error instanceof Error
            ? error.message
            : "Could not load your saved app data.",
        );
      } finally {
        if (isActive) setInitialized(true);
      }
    }

    void initialize();
    return () => {
      isActive = false;
    };
  }, [initializationAttempt]);

  const completeOnboarding = useCallback(async () => {
    await saveOnboardingSeen();
    setOnboardingSeen(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const nextSession = await signIn(email, password);
    setSession(nextSession);
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setSession(null);
  }, []);

  const retryInitialization = useCallback(() => {
    setInitialized(false);
    setInitializationAttempt((attempt) => attempt + 1);
  }, []);

  const value = useMemo(
    () => ({
      session,
      onboardingSeen,
      initialized,
      initializationError,
      completeOnboarding,
      login,
      logout,
      retryInitialization,
    }),
    [
      session,
      onboardingSeen,
      initialized,
      initializationError,
      completeOnboarding,
      login,
      logout,
      retryInitialization,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
