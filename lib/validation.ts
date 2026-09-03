import { LEVELS, RESULTS, STATUSES } from "./constants";
import type { ApplicationInput } from "./types";

export interface ValidationResult {
  ok: boolean;
  errors: Record<string, string>;
  data: ApplicationInput;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function requiredText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(value: unknown): string | null {
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed === "" ? null : trimmed;
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateApplication(body: unknown): ValidationResult {
  const errors: Record<string, string> = {};
  const input = (body ?? {}) as Record<string, unknown>;

  const school = requiredText(input.school);
  const city = requiredText(input.city);
  const program = requiredText(input.program);
  const level = requiredText(input.level);
  const status = requiredText(input.status);
  const result = optionalText(input.result) ?? "Not Published";

  if (!school) errors.school = "School is required.";
  if (!city) errors.city = "City is required.";
  if (!program) errors.program = "Program is required.";
  if (!level) errors.level = "Level is required.";
  else if (!(LEVELS as readonly string[]).includes(level)) errors.level = "Invalid level.";

  if (!status) errors.status = "Status is required.";
  else if (!(STATUSES as readonly string[]).includes(status)) errors.status = "Invalid status.";

  if (!(RESULTS as readonly string[]).includes(result)) errors.result = "Invalid result.";

  const dateFields = [
    "applicationDate",
    "deadline",
    "examDate",
    "expectedResultDate",
  ] as const;

  const dates: Record<(typeof dateFields)[number], string | null> = {
    applicationDate: null,
    deadline: null,
    examDate: null,
    expectedResultDate: null,
  };

  for (const field of dateFields) {
    const value = optionalText(input[field]);
    dates[field] = value;
    if (value && !DATE_RE.test(value)) {
      errors[field] = "Invalid date format.";
    }
  }

  const officialLink = optionalText(input.officialLink);
  const resultsLink = optionalText(input.resultsLink);

  if (officialLink && !isValidUrl(officialLink)) {
    errors.officialLink = "Enter a valid URL starting with http:// or https://";
  }
  if (resultsLink && !isValidUrl(resultsLink)) {
    errors.resultsLink = "Enter a valid URL starting with http:// or https://";
  }

  const data: ApplicationInput = {
    school,
    city,
    program,
    level,
    applicationDate: dates.applicationDate,
    deadline: dates.deadline,
    examDate: dates.examDate,
    expectedResultDate: dates.expectedResultDate,
    status,
    result,
    officialLink,
    resultsLink,
    notes: optionalText(input.notes),
  };

  return { ok: Object.keys(errors).length === 0, errors, data };
}
