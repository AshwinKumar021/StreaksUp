import type { AuthSession } from "@/types";
import { FAKE_LOGIN_DELAY_MS } from "@/utils/constants";
import { saveSession } from "./storage";

export async function signIn(email: string, password: string): Promise<AuthSession> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, FAKE_LOGIN_DELAY_MS);
  });

  const session: AuthSession = {
    userId: email.trim().toLowerCase(),
    email: email.trim().toLowerCase(),
    name: nameFromEmail(email),
    memberSince: "January 2025",
  };
  await saveSession(session);
  return session;
}

function nameFromEmail(email: string): string {
  const localPart = email.split("@")[0] ?? "";
  const name = localPart
    .split(/[._+-]/)
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase()}${part.slice(1)}`)
    .join(" ");
  return name || "Habit Builder";
}
