import type { AuthResponse, User } from "./types";

/**
 * Token storage. For the prototype we keep tokens in localStorage;
 * in production move access tokens to memory (httpOnly cookies via a BFF).
 *
 * Keys are prefixed so Next dev servers on other ports don't collide.
 */

const ACCESS_KEY = "hrm.access_token";
const REFRESH_KEY = "hrm.refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setSession(auth: AuthResponse): void {
  localStorage.setItem(ACCESS_KEY, auth.access_token);
  localStorage.setItem(REFRESH_KEY, auth.refresh_token);
  localStorage.setItem("hrm.user", JSON.stringify(auth.user));
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("hrm.user");
  return raw ? (JSON.parse(raw) as User) : null;
}

export function clearSession(): void {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem("hrm.user");
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}
