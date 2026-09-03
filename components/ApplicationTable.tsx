"use client";

import { useMemo, useState } from "react";
import { RESULT_BADGE, STATUSES, STATUS_BADGE } from "@/lib/constants";
import type { Application } from "@/lib/types";
import { daysUntil, deadlineWarning, examWarning, formatDate } from "@/lib/utils";

type SortField = "school" | "deadline" | "examDate" | "expectedResultDate" | "status";
type SortDir = "asc" | "desc";
type SortState = { field: SortField; dir: SortDir } | null;

const badgeBase =
  "inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset";

const cellClass = "px-3 py-2 align-top text-sm text-gray-600 whitespace-nowrap";

const columns: { key: SortField | null; label: string }[] = [
  { key: "school", label: "School" },
  { key: null, label: "City" },
  { key: null, label: "Program / Speciality" },
  { key: null, label: "Level" },
  { key: null, label: "Applied On" },
  { key: "deadline", label: "Deadline" },
  { key: "examDate", label: "Exam Date" },
  { key: "expectedResultDate", label: "Expected Result" },
  { key: "status", label: "Status" },
  { key: null, label: "Result" },
  { key: null, label: "Official Link" },
  { key: null, label: "Results Link" },
  { key: null, label: "Notes" },
  { key: null, label: "Actions" },
];

function compareUrgency(a: Application, b: Application): number {
  const daysA = a.deadline ? daysUntil(a.deadline) : null;
  const daysB = b.deadline ? daysUntil(b.deadline) : null;
  if (daysA === null && daysB === null) return a.school.localeCompare(b.school);
  if (daysA === null) return 1;
  if (daysB === null) return -1;
  if (daysA >= 0 && daysB >= 0) return daysA - daysB;
  if (daysA < 0 && daysB < 0) return daysB - daysA;
  return daysA >= 0 ? -1 : 1;
}

function compareBy(field: SortField, dir: SortDir) {
  return (a: Application, b: Application): number => {
    let result = 0;
    if (field === "school") {
      result = a.school.localeCompare(b.school);
    } else if (field === "status") {
      result =
        (STATUSES as readonly string[]).indexOf(a.status) -
        (STATUSES as readonly string[]).indexOf(b.status);
    } else {
      const valueA = a[field] ?? "";
      const valueB = b[field] ?? "";
      if (!valueA && valueB) return 1;
      if (valueA && !valueB) return -1;
      result = valueA.localeCompare(valueB);
    }
    return dir === "asc" ? result : -result;
  };
}

interface ApplicationTableProps {
  applications: Application[];
  totalCount: number;
  onEdit: (application: Application) => void;
  onDelete: (application: Application) => void;
}

export default function ApplicationTable({
  applications,
  totalCount,
  onEdit,
  onDelete,
}: ApplicationTableProps) {
  const [sort, setSort] = useState<SortState>(null);

  const sorted = useMemo(() => {
    const copy = [...applications];
    copy.sort(sort ? compareBy(sort.field, sort.dir) : compareUrgency);
    return copy;
  }, [applications, sort]);

  function handleSortClick(field: SortField) {
    setSort((previous) => {
      if (!previous || previous.field !== field) return { field, dir: "asc" };
      if (previous.dir === "asc") return { field, dir: "desc" };
      return null;
    });
  }

  function sortIndicator(field: SortField): string {
    if (!sort || sort.field !== field) return "";
    return sort.dir === "asc" ? " ▲" : " ▼";
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full min-w-[1360px] text-left">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((column) => (
              <th
                key={column.label}
                scope="col"
                className={`px-3 py-2.5 text-xs font-semibold tracking-wide text-gray-500 uppercase ${
                  column.key ? "cursor-pointer select-none hover:text-gray-800" : ""
                }`}
                onClick={column.key ? () => handleSortClick(column.key!) : undefined}
              >
                {column.label}
                {column.key ? sortIndicator(column.key) : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.map((application) => {
            const warning = deadlineWarning(application.deadline);
            const exam = examWarning(application.examDate);
            return (
              <tr key={application.id} className="hover:bg-gray-50/60">
                <td className={`${cellClass} max-w-[200px] truncate font-medium text-gray-900`} title={application.school}>
                  {application.school}
                </td>
                <td className={cellClass}>{application.city}</td>
                <td className={cellClass}>{application.program}</td>
                <td className={cellClass}>{application.level}</td>
                <td className={cellClass}>{formatDate(application.applicationDate)}</td>
                <td className={cellClass}>
                  <div>{formatDate(application.deadline)}</div>
                  {warning && warning.tone !== "normal" && (
                    <span
                      className={`text-xs font-medium ${
                        warning.tone === "warn" ? "text-orange-600" : "text-red-600"
                      }`}
                    >
                      {warning.label}
                    </span>
                  )}
                </td>
                <td className={cellClass}>
                  <div>{formatDate(application.examDate)}</div>
                  {exam && <span className="text-xs font-medium text-orange-600">{exam}</span>}
                </td>
                <td className={cellClass}>{formatDate(application.expectedResultDate)}</td>
                <td className="px-3 py-2 align-top">
                  <span
                    className={`${badgeBase} ${
                      STATUS_BADGE[application.status] ??
                      "bg-gray-100 text-gray-600 ring-gray-200"
                    }`}
                  >
                    {application.status}
                  </span>
                </td>
                <td className="px-3 py-2 align-top">
                  <span
                    className={`${badgeBase} ${
                      RESULT_BADGE[application.result] ??
                      "bg-gray-100 text-gray-600 ring-gray-200"
                    }`}
                  >
                    {application.result}
                  </span>
                </td>
                <td className="px-3 py-2 align-top">
                  {application.officialLink ? (
                    <a
                      href={application.officialLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-blue-600 underline-offset-2 hover:underline"
                    >
                      Open
                    </a>
                  ) : (
                    <span className="text-sm text-gray-300">—</span>
                  )}
                </td>
                <td className="px-3 py-2 align-top">
                  {application.resultsLink ? (
                    <a
                      href={application.resultsLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-blue-600 underline-offset-2 hover:underline"
                    >
                      Check Results
                    </a>
                  ) : (
                    <span className="text-sm text-gray-300">—</span>
                  )}
                </td>
                <td className={`${cellClass} max-w-[180px] truncate`} title={application.notes ?? ""}>
                  {application.notes || "—"}
                </td>
                <td className="px-3 py-2 align-top">
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(application)}
                      className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(application)}
                      className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {sorted.length === 0 && (
        <div className="px-4 py-10 text-center text-sm text-gray-500">
          {totalCount === 0
            ? "No applications yet. Click “+ Add Application” to create your first one."
            : "No applications match your search or filters."}
        </div>
      )}
    </div>
  );
}
