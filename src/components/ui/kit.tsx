import { cn } from "@/lib/utils";
import { TIME_ENTRY_STATUSES, USER_ROLES, type TimeEntryStatus, type UserRole } from "@/lib/types";

/** Field wrapper: label on top, error/helper below — used inside modals. */
export function FormRow({
  label,
  htmlFor,
  error,
  helper,
  children,
  required,
}: {
  label: string;
  htmlFor?: string;
  error?: string | string[];
  helper?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  const errorText = Array.isArray(error) ? error[0] : error;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-text">
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {children}
      {errorText ? (
        <p className="text-xs text-danger">{errorText}</p>
      ) : helper ? (
        <p className="text-xs text-text-secondary">{helper}</p>
      ) : null}
    </div>
  );
}

/** Text input matching the token set (uses `peer` class to allow icons). */
export function Input({
  className,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded border bg-surface px-3 text-sm text-text placeholder:text-text-disabled",
        "focus:outline-none focus:ring-2 focus:ring-primary/40",
        error ? "border-danger" : "border-border focus:border-primary",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Status + role pills from lib/types enums.
 *  - employee/user: admin(indigo), user(gray)
 *  - time entry: COMPLETE green, INCOMPLETE amber, INVALID red
 */
const badgeTones: Record<string, string> = {
  admin: "bg-primary-soft text-primary",
  user: "bg-muted text-text-secondary",
  COMPLETE: "bg-success-soft text-success",
  INCOMPLETE: "bg-warning-soft text-warning",
  INVALID: "bg-danger-soft text-danger",
  active: "bg-success-soft text-success",
  inactive: "bg-muted text-text-disabled",
};

export function Badge({
  value,
  tone,
  children,
  className,
}: {
  value: string;
  tone?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const key =
    tone ??
    (USER_ROLES.includes(value as UserRole) || TIME_ENTRY_STATUSES.includes(value as TimeEntryStatus)
      ? value
      : value.toLowerCase());
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        badgeTones[key] ?? "bg-muted text-text-secondary",
        className,
      )}
    >
      {children ?? value}
    </span>
  );
}
