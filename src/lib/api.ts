import { clearSession, getAccessToken, getRefreshToken, setSession } from "./auth";
import type { ApiError, AuthResponse, Paginated, PaginationQuery } from "./types";

/**
 * Thin typed fetch wrapper for the HR Management API.
 *
 * - injects `Authorization: Bearer <access_token>`
 * - on a 401 it transparently POSTs /auth/refresh once, then retries the
 *   original request; if the refresh fails the session is cleared and the
 *   caller is redirected to /login
 * - normalises errors into ApiError (message can be a string or a string[]
 *   from class-validator)
 */

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export class FetchError extends Error {
  statusCode: number;
  /** class-validator may return a string[] with one entry per failed field (renamed to cover Error.message) */
  errorMessage: string | string[];
  error?: string;
  details?: unknown;

  constructor(apiError: Partial<ApiError> & { statusCode: number }) {
    super(
      typeof apiError.message === "string"
        ? apiError.message
        : Array.isArray(apiError.message)
          ? apiError.message.join(", ")
          : "Unknown error",
    );
    this.name = "FetchError";
    this.statusCode = apiError.statusCode;
    this.errorMessage = apiError.message ?? "Unknown error";
    this.error = apiError.error;
    this.details = apiError.details;
  }

  /** First validation error (class-validator may send a string[]) */
  get firstMessage(): string {
    return Array.isArray(this.errorMessage) ? this.errorMessage[0] : this.errorMessage;
  }
}

export function toQueryString(query: PaginationQuery): string {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.search) params.set("search", query.search);
  for (const [key, value] of Object.entries(query.filter ?? {})) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(`filter.${key}`, String(value));
    }
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  /** public endpoints that must NOT get a Bearer header */
  isPublic?: boolean;
  /** skip the automatic 401 → refresh → retry flow */
  skipAuth?: boolean;
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, isPublic = false, skipAuth = false } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (!isPublic) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.ok) {
    // 204 No Content (DELETE endpoints)
    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  }

  // ---- token expired or invalid: try ONE refresh then retry ----
  if (response.status === 401 && !isPublic && !skipAuth) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      return apiFetch<T>(path, { ...options, skipAuth: true });
    }
    clearSession();
    if (typeof window !== "undefined" && !location.pathname.startsWith("/login")) {
      location.replace("/login");
    }
  }

  let payload: Partial<ApiError> = {};
  try {
    payload = await response.json();
  } catch {
    /* non-JSON error body — keep defaults */
  }

  throw new FetchError({
    statusCode: response.status,
    message: payload.message ?? `Request failed (${response.status})`,
    error: payload.error,
    details: payload.details,
  });
}

/**
 * POST /auth/refresh — exchange a valid refresh token for a new token pair.
 * Returns null when the refresh token is invalid/expired.
 */
export async function refreshTokens(): Promise<AuthResponse | null> {
  const refresh_token = getRefreshToken();
  if (!refresh_token) return null;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token }),
    });
    if (!res.ok) return null;
    const auth = (await res.json()) as AuthResponse;
    setSession(auth);
    return auth;
  } catch {
    return null;
  }
}

// ---------- convenience wrappers ----------

export const api = {
  list: <T>(resource: string, query: PaginationQuery = {}) =>
    apiFetch<Paginated<T>>(`${resource}${toQueryString(query)}`),
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: "PATCH", body }),
  put: <T>(path: string, body: unknown) => apiFetch<T>(path, { method: "PUT", body }),
  delete: <T = void>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: "DELETE", body }),
};
