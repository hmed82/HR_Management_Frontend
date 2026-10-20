/**
 * DTOs mirroring the NestJS backend (the `dto` folders under hr_management/src).
 * Source of truth: hr_management docs/frontend-spec.md section 5 "API contract"
 */

// ---------- enums ----------

export const USER_ROLES = ["admin", "user"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const TIME_ENTRY_STATUSES = ["COMPLETE", "INCOMPLETE", "INVALID"] as const;
export type TimeEntryStatus = (typeof TIME_ENTRY_STATUSES)[number];

// ---------- auth ----------

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    role: UserRole;
  };
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name?: string;
  email: string;
  password: string;
}

// ---------- users ----------

export interface User {
  id: number;
  email: string;
  name?: string;
  phoneNumber?: string;
  isActive: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// ---------- departments ----------

export interface Department {
  id: number;
  name: string;
  description?: string;
  employeeCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentDto {
  name: string;
  description?: string;
}

export type UpdateDepartmentDto = Partial<CreateDepartmentDto>;

// ---------- employees ----------

export interface SimpleDepartment {
  id: number;
  name: string;
}

export interface SimpleManager {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  hireDate?: string;
  departmentId?: number;
  department?: SimpleDepartment;
  managerId?: number | null;
  manager?: SimpleManager;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  hireDate?: string;
  departmentId: number;
  managerId?: number | null;
  isActive?: boolean;
}

export type UpdateEmployeeDto = Partial<CreateEmployeeDto>;

// ---------- time entries ----------

export interface TimeEntry {
  id: number;
  employeeId: number;
  date: string; // YYYY-MM-DD
  clockIn: string; // HH:mm:ss
  clockOut: string | null;
  status: TimeEntryStatus;
  createdAt: string;
  updatedAt: string;
  employee?: Employee;
}

export interface CreateTimeEntryDto {
  employeeId: number;
  date: string;
  clockIn: string;
  clockOut?: string;
}

export type UpdateTimeEntryDto = Partial<CreateTimeEntryDto>;

// ---------- statistics ----------

export interface EmployeeStatistics {
  total: number;
  active: number;
  inactive: number;
  byDepartment: Array<{
    departmentId: number;
    departmentName: string;
    count: number;
  }>;
}

export interface TimeEntryStatistics {
  total: number;
  byStatus: Array<{ status: TimeEntryStatus; count: number }>;
}

// ---------- import ----------

export interface BulkImportResult {
  message: string;
  total: number;
  imported: number;
  failed: number;
  errors: Array<{
    employeeId: number;
    date: string;
    error: string;
  }>;
}

export interface BulkDeleteResult {
  deleted: number;
  failed: number;
  errors: string[];
}

// ---------- pagination (nestjs-paginate envelope) ----------

export interface PaginationMeta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  sortBy: Array<[string, "ASC" | "DESC"]>;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
  links: {
    first: string;
    previous?: string;
    current: string;
    next?: string;
    last: string;
  };
}

// ---------- query helpers ----------

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string; // e.g. "id:ASC"
  search?: string;
  filter?: Record<string, string | number | boolean | undefined>;
}

// ---------- API error envelope ----------

export interface ApiError {
  message: string | string[];
  error?: string;
  statusCode: number;
  details?: unknown;
}

// ---------- runtime formatters ----------

export const formatEmployeeName = (e?: Pick<Employee, "firstName" | "lastName"> | null) =>
  e ? `${e.firstName} ${e.lastName}` : "—";
