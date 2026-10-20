import { api } from "./api";
import type {
  AuthResponse,
  BulkDeleteResult,
  BulkImportResult,
  CreateDepartmentDto,
  CreateEmployeeDto,
  CreateTimeEntryDto,
  Department,
  Employee,
  EmployeeStatistics,
  LoginDto,
  RegisterDto,
  TimeEntry,
  TimeEntryStatistics,
  UpdateDepartmentDto,
  UpdateEmployeeDto,
  UpdateTimeEntryDto,
  User,
} from "./types";

/**
 * Endpoint-per-resource wrappers. All list calls return the nestjs-paginate
 * envelope { data, meta, links } — see lib/types.ts.
 */

// ---------- auth ----------

export const authApi = {
  login: (dto: LoginDto) => api.post<AuthResponse>("/auth/login", dto),
  register: (dto: RegisterDto) => api.post<AuthResponse>("/auth/register", dto),
  me: () => api.get<User>("/auth/me"),
};

// ---------- departments ----------

export const departmentsApi = {
  list: (query = {}) => api.list<Department>("/departments", query),
  listWithCount: (query = {}) => api.list<Department>("/departments/employee-count", query),
  get: (id: number) => api.get<Department>(`/departments/${id}`),
  create: (dto: CreateDepartmentDto) => api.post<Department>("/departments", dto),
  update: (id: number, dto: UpdateDepartmentDto) =>
    api.patch<Department>(`/departments/${id}`, dto),
  remove: (id: number) => api.delete<void>(`/departments/${id}`),
};

// ---------- employees ----------

export const employeesApi = {
  list: (query = {}) => api.list<Employee>("/employees", query),
  statistics: () => api.get<EmployeeStatistics>("/employees/stats/overview"),
  listByDepartment: (departmentId: number, query = {}) =>
    api.list<Employee>(`/employees/department/${departmentId}`, query),
  get: (id: number) => api.get<Employee>(`/employees/${id}`),
  getWithDepartment: (id: number) => api.get<Employee>(`/employees/${id}/department`),
  subordinates: (id: number, query = {}) =>
    api.list<Employee>(`/employees/${id}/subordinates`, query),
  create: (dto: CreateEmployeeDto) => api.post<Employee>("/employees", dto),
  update: (id: number, dto: UpdateEmployeeDto) =>
    api.patch<Employee>(`/employees/${id}`, dto),
  remove: (id: number) => api.delete<void>(`/employees/${id}`),
};

// ---------- time entries ----------

export const timeEntriesApi = {
  list: (query = {}) => api.list<TimeEntry>("/time-entries", query),
  statistics: () => api.get<TimeEntryStatistics>("/time-entries/stats/overview"),
  listByDateRange: (
    startDate: string,
    endDate: string,
    query = {},
  ) => api.list<TimeEntry>(`/time-entries/date-range?startDate=${startDate}&endDate=${endDate}`, query),
  listByEmployee: (employeeId: number, query = {}) =>
    api.list<TimeEntry>(`/time-entries/employee/${employeeId}`, query),
  get: (id: number) => api.get<TimeEntry>(`/time-entries/${id}`),
  create: (dto: CreateTimeEntryDto) => api.post<TimeEntry>("/time-entries", dto),
  update: (id: number, dto: UpdateTimeEntryDto) =>
    api.put<TimeEntry>(`/time-entries/${id}`, dto),
  bulkDelete: (ids: number[]) => api.delete<BulkDeleteResult>("/time-entries/bulk", { ids }),
  remove: (id: number) => api.delete<void>(`/time-entries/${id}`),
  // NOTE: endpoints below use multipart/form-data — call fetch directly or
  // extend apiFetch; kept out of the plain api wrapper.
};

/** Excel template download (streams a .xlsx blob) */
export async function downloadTimeEntriesTemplate(): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"}/time-entries/export/template`);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "time-entries-template.xlsx";
  a.click();
  URL.revokeObjectURL(url);
}

/** Excel bulk import (multipart/form-data with field "file", max 10MB) */
export async function importTimeEntriesExcel(file: File): Promise<BulkImportResult> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"}/time-entries/import/excel`,
    {
      method: "POST",
      headers: { Accept: "application/json" },
      body: form,
    },
  );
  const payload = await res.json();
  if (!res.ok) throw new Error(payload.message ?? "Import failed");
  return payload as BulkImportResult;
}

// ---------- users ----------

export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
  role?: "admin" | "user";
  isActive?: boolean;
}

export type UpdateUserDto = Partial<Omit<CreateUserDto, "email">>;

export const usersApi = {
  list: (query = {}) => api.list<User>("/users", query),
  me: () => api.get<User>("/users/me"),
  get: (id: number) => api.get<User>(`/users/${id}`),
  create: (dto: CreateUserDto) => api.post<User>("/users", dto),
  updateSelf: (id: number, dto: { name?: string; password?: string }) =>
    api.patch<User>(`/users/${id}`, dto),
  updateAsAdmin: (id: number, dto: UpdateUserDto) => api.patch<User>(`/users/${id}`, dto),
  remove: (id: number) => api.delete<void>(`/users/${id}`),
};
