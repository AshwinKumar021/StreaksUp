import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AuthSession } from "@/types";
import { STORAGE_KEYS } from "@/utils/constants";

export async function getSession(): Promise<AuthSession | null> {
  const serializedSession = await AsyncStorage.getItem(STORAGE_KEYS.session);
  if (!serializedSession) return null;

  try {
    return JSON.parse(serializedSession) as AuthSession;
  } catch (error) {
    await AsyncStorage.removeItem(STORAGE_KEYS.session);
    throw new Error("Saved sign-in data could not be read.", { cause: error });
  }
}

export async function saveSession(session: AuthSession): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.session);
}

export async function getOnboardingSeen(): Promise<boolean> {
  return (await AsyncStorage.getItem(STORAGE_KEYS.onboardingSeen)) === "true";
}

export async function saveOnboardingSeen(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.onboardingSeen, "true");
}
