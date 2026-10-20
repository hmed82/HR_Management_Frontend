"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormRow, Input } from "@/components/ui/kit";
import { setSession } from "@/lib/auth";
import { FetchError } from "@/lib/api";
import { authApi } from "@/lib/services";
import type { ApiError } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [state, setState] = useState({ email: "", password: "" });
  const { email, password } = state;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError["message"] | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const auth = await authApi.login({ email, password });
      setSession(auth);
      router.replace("/");
    } catch (err) {
      setError(err instanceof FetchError ? err.errorMessage : ["Network error"]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center px-6">
      <div className="card w-full max-w-sm p-8">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="bg-primary grid size-11 place-items-center rounded-xl text-lg font-bold text-white">
            HR
          </span>
          <h1 className="text-xl font-semibold">HR Management</h1>
          <p className="text-sm text-text-secondary">Sign in to continue</p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {error && (
            <p className="rounded border border-danger-soft bg-danger-soft px-3 py-2 text-xs text-danger">
              {Array.isArray(error) ? error[0] : error}
            </p>
          )}

          <FormRow label="Email" htmlFor="email">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
              error={error != null}
            />
          </FormRow>

          <FormRow label="Password" htmlFor="password" helper="Minimum 6 characters">
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setState((s) => ({ ...s, password: e.target.value }))}
              error={error != null}
            />
          </FormRow>

          <Button type="submit" loading={loading} className="mt-2 w-full">
            Sign in
          </Button>
        </form>
      </div>
    </main>
  );
}
