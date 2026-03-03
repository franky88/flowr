export type ApiErrorCode =
  | "validation_error"
  | "duplicate_entry"
  | "not_found"
  | "forbidden"
  | "unauthorized"
  | "plan_limit_exceeded"
  | "internal_error"
  | "bad_request"
  | "conflict"
  | "too_many_requests"
  | "error";

export interface ApiErrorBody {
  error: ApiErrorCode;
  message: string;
  fields?: Record<string, string>; // field-level validation errors
  limit_key?: string;              // plan enforcement
}

export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  readonly fields?: Record<string, string>;
  readonly limitKey?: string;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.status = status;
    this.code = body.error;
    this.fields = body.fields;
    this.limitKey = body.limit_key;
    this.name = "ApiError";
  }

  get isNotFound() { return this.status === 404; }
  get isUnauthorized() { return this.status === 401; }
  get isForbidden() { return this.status === 403; }
  get isValidation() { return this.status === 400; }
  get isPlanLimit() { return this.status === 402; }
  get isServer() { return this.status >= 500; }
}