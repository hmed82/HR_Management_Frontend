import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge, FormRow, Input } from "@/components/ui/kit";
import { isAuthenticated } from "@/lib/auth";
import { API_URL } from "@/lib/api";

/**
 * Starter placeholder. Real screens are built from docs/frontend-spec.md
 * (../hr_management/docs/frontend-spec.md): login, dashboard, employees,
 * departments, time entries, users.
 */
export default function Home() {
  const loggedIn =
    typeof window !== "undefined" && isAuthenticated();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-16">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="bg-primary text-white grid size-10 place-items-center rounded-xl text-lg font-bold">
            HR
          </span>
          <div>
            <h1 className="screen-title">HR Management</h1>
            <p className="text-sm text-text-secondary">
              Frontend scaffold — wired to the NestJS API
            </p>
          </div>
        </div>
        <Badge value={loggedIn ? "active" : "inactive"}>
          {loggedIn ? "Session active" : "Not signed in"}
        </Badge>
      </header>

      <section className="card flex flex-col gap-4 p-6">
        <h2 className="text-base font-semibold">Palette tokens in use</h2>
        <div className="flex flex-wrap gap-3">
          <Button size="sm">Primary</Button>
          <Button size="sm" variant="secondary">Secondary</Button>
          <Button size="sm" variant="outline">Outline</Button>
          <Button size="sm" variant="danger">Danger</Button>
          <Button size="sm" variant="ghost">Ghost</Button>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex w-full max-w-xs flex-col gap-4">
            <FormRow label="Email" helper="Text tokens: surface / border / text-secondary">
              <Input placeholder="admin@example.com" />
            </FormRow>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge value="admin" />
          <Badge value="user" />
          <Badge value="COMPLETE" />
          <Badge value="INCOMPLETE" />
          <Badge value="INVALID" />
        </div>
      </section>

      <nav className="flex flex-wrap gap-3">
        <Link href="/login" className="text-primary text-sm font-medium hover:underline">
          Go to login →
        </Link>
        <a
          href={`${API_URL}/api`}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-text-secondary hover:underline"
        >
          API Swagger docs ↗
        </a>
      </nav>
    </main>
  );
}
