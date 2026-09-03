"use client";

import { useState } from "react";
import { LEVELS, RESULTS, STATUSES } from "@/lib/constants";
import type { Application, ApplicationInput } from "@/lib/types";

type FormValues = {
  school: string;
  city: string;
  program: string;
  level: string;
  applicationDate: string;
  deadline: string;
  examDate: string;
  expectedResultDate: string;
  status: string;
  result: string;
  officialLink: string;
  resultsLink: string;
  notes: string;
};

interface ApplicationFormProps {
  initial: Application | null;
  onSave: (input: ApplicationInput) => Promise<void>;
  onCancel: () => void;
}

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-gray-400 focus:outline-none";

const labelClass = "mb-1 block text-xs font-medium text-gray-600";

const errorClass = "mt-1 text-xs text-red-600";

function toFormValues(application: Application | null): FormValues {
  return {
    school: application?.school ?? "",
    city: application?.city ?? "",
    program: application?.program ?? "",
    level: application?.level ?? "",
    applicationDate: application?.applicationDate ?? "",
    deadline: application?.deadline ?? "",
    examDate: application?.examDate ?? "",
    expectedResultDate: application?.expectedResultDate ?? "",
    status: application?.status ?? "To Apply",
    result: application?.result ?? "Not Published",
    officialLink: application?.officialLink ?? "",
    resultsLink: application?.resultsLink ?? "",
    notes: application?.notes ?? "",
  };
}

function toInput(values: FormValues): ApplicationInput {
  const trim = (value: string) => value.trim();
  return {
    school: trim(values.school),
    city: trim(values.city),
    program: trim(values.program),
    level: values.level,
    applicationDate: values.applicationDate || null,
    deadline: values.deadline || null,
    examDate: values.examDate || null,
    expectedResultDate: values.expectedResultDate || null,
    status: values.status,
    result: values.result,
    officialLink: trim(values.officialLink) || null,
    resultsLink: trim(values.resultsLink) || null,
    notes: trim(values.notes) || null,
  };
}

export default function ApplicationForm({ initial, onSave, onCancel }: ApplicationFormProps) {
  const [values, setValues] = useState<FormValues>(toFormValues(initial));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function set<K extends keyof FormValues>(key: K, value: string) {
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};
    if (!values.school.trim()) nextErrors.school = "School is required.";
    if (!values.city.trim()) nextErrors.city = "City is required.";
    if (!values.program.trim()) nextErrors.program = "Program is required.";
    if (!values.level) nextErrors.level = "Level is required.";
    if (!values.status) nextErrors.status = "Status is required.";
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSaving(true);
    setErrors({});
    try {
      await onSave(toInput(values));
    } catch (payload) {
      const errorPayload = (payload ?? {}) as {
        error?: string;
        errors?: Record<string, string>;
      };
      setErrors({
        ...(errorPayload.errors ?? {}),
        ...(!errorPayload.errors && errorPayload.error ? { form: errorPayload.error } : {}),
      });
      setSaving(false);
    }
  }

  function fieldError(key: string): string | undefined {
    return errors[key];
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={initial ? "Edit application" : "Add application"}
        className="mx-auto my-6 w-full max-w-2xl rounded-xl bg-white p-5 shadow-xl"
      >
        <h2 className="text-base font-semibold text-gray-900">
          {initial ? "Edit Application" : "Add Application"}
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <fieldset disabled={saving} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="school" className={labelClass}>
                School *
              </label>
              <input
                id="school"
                type="text"
                value={values.school}
                onChange={(event) => set("school", event.target.value)}
                placeholder="ENSA Beni Mellal"
                className={inputClass}
              />
              {fieldError("school") && <p className={errorClass}>{fieldError("school")}</p>}
            </div>

            <div>
              <label htmlFor="city" className={labelClass}>
                City *
              </label>
              <input
                id="city"
                type="text"
                value={values.city}
                onChange={(event) => set("city", event.target.value)}
                placeholder="Beni Mellal"
                className={inputClass}
              />
              {fieldError("city") && <p className={errorClass}>{fieldError("city")}</p>}
            </div>

            <div>
              <label htmlFor="program" className={labelClass}>
                Program / Speciality *
              </label>
              <input
                id="program"
                type="text"
                value={values.program}
                onChange={(event) => set("program", event.target.value)}
                placeholder="Informatique"
                className={inputClass}
              />
              {fieldError("program") && <p className={errorClass}>{fieldError("program")}</p>}
            </div>

            <div>
              <label htmlFor="level" className={labelClass}>
                Level *
              </label>
              <select
                id="level"
                value={values.level}
                onChange={(event) => set("level", event.target.value)}
                className={inputClass}
              >
                <option value="">Select…</option>
                {LEVELS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              {fieldError("level") && <p className={errorClass}>{fieldError("level")}</p>}
            </div>

            <div>
              <label htmlFor="applicationDate" className={labelClass}>
                Application Date
              </label>
              <input
                id="applicationDate"
                type="date"
                value={values.applicationDate}
                onChange={(event) => set("applicationDate", event.target.value)}
                className={inputClass}
              />
              {fieldError("applicationDate") && (
                <p className={errorClass}>{fieldError("applicationDate")}</p>
              )}
            </div>

            <div>
              <label htmlFor="deadline" className={labelClass}>
                Deadline
              </label>
              <input
                id="deadline"
                type="date"
                value={values.deadline}
                onChange={(event) => set("deadline", event.target.value)}
                className={inputClass}
              />
              {fieldError("deadline") && <p className={errorClass}>{fieldError("deadline")}</p>}
            </div>

            <div>
              <label htmlFor="examDate" className={labelClass}>
                Exam Date
              </label>
              <input
                id="examDate"
                type="date"
                value={values.examDate}
                onChange={(event) => set("examDate", event.target.value)}
                className={inputClass}
              />
              {fieldError("examDate") && <p className={errorClass}>{fieldError("examDate")}</p>}
            </div>

            <div>
              <label htmlFor="expectedResultDate" className={labelClass}>
                Expected Result Date
              </label>
              <input
                id="expectedResultDate"
                type="date"
                value={values.expectedResultDate}
                onChange={(event) => set("expectedResultDate", event.target.value)}
                className={inputClass}
              />
              {fieldError("expectedResultDate") && (
                <p className={errorClass}>{fieldError("expectedResultDate")}</p>
              )}
            </div>

            <div>
              <label htmlFor="status" className={labelClass}>
                Status *
              </label>
              <select
                id="status"
                value={values.status}
                onChange={(event) => set("status", event.target.value)}
                className={inputClass}
              >
                {STATUSES.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              {fieldError("status") && <p className={errorClass}>{fieldError("status")}</p>}
            </div>

            <div>
              <label htmlFor="result" className={labelClass}>
                Result
              </label>
              <select
                id="result"
                value={values.result}
                onChange={(event) => set("result", event.target.value)}
                className={inputClass}
              >
                {RESULTS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              {fieldError("result") && <p className={errorClass}>{fieldError("result")}</p>}
            </div>

            <div>
              <label htmlFor="officialLink" className={labelClass}>
                Official Link
              </label>
              <input
                id="officialLink"
                type="url"
                value={values.officialLink}
                onChange={(event) => set("officialLink", event.target.value)}
                placeholder="https://…"
                className={inputClass}
              />
              {fieldError("officialLink") && (
                <p className={errorClass}>{fieldError("officialLink")}</p>
              )}
            </div>

            <div>
              <label htmlFor="resultsLink" className={labelClass}>
                Results Link
              </label>
              <input
                id="resultsLink"
                type="url"
                value={values.resultsLink}
                onChange={(event) => set("resultsLink", event.target.value)}
                placeholder="https://…"
                className={inputClass}
              />
              {fieldError("resultsLink") && (
                <p className={errorClass}>{fieldError("resultsLink")}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="notes" className={labelClass}>
                Notes
              </label>
              <textarea
                id="notes"
                rows={2}
                value={values.notes}
                onChange={(event) => set("notes", event.target.value)}
                placeholder="e.g. Need original diploma, exam at 09:00…"
                className={`${inputClass} resize-y`}
              />
              {fieldError("notes") && <p className={errorClass}>{fieldError("notes")}</p>}
            </div>
          </fieldset>

          {errors.form && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errors.form}</p>
          )}

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
