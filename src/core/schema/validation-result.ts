export type SchemaValidationIssue = {
  path: Array<string | number>;
  message: string;
  code: string;
};

export type SchemaValidationSuccess<T> = {
  ok: true;
  data: T;
  issues: [];
};

export type SchemaValidationFailure = {
  ok: false;
  data?: undefined;
  issues: SchemaValidationIssue[];
};

export type SchemaValidationResult<T> =
  | SchemaValidationSuccess<T>
  | SchemaValidationFailure;

export function validationSuccess<T>(data: T): SchemaValidationSuccess<T> {
  return { ok: true, data, issues: [] };
}

export function validationFailure(
  issues: SchemaValidationIssue[],
): SchemaValidationFailure {
  return { ok: false, issues };
}
