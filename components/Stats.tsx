"use client";

import { useMemo } from "react";
import type { Application } from "@/lib/types";
import { daysUntil } from "@/lib/utils";

export default function Stats({ applications }: { applications: Application[] }) {
  const stats = useMemo(() => {
    const countInvolved = (value: string) =>
      applications.filter((a) => a.status === value || a.result === value).length;

    const upcomingExams = applications.filter((a) => {
      if (!a.examDate) return false;
      const days = daysUntil(a.examDate);
      return days !== null && days >= 0 && days <= 30;
    }).length;

    return {
      total: applications.length,
      waiting: applications.filter((a) => a.status === "Waiting").length,
      upcomingExams,
      admitted: countInvolved("Admitted"),
      waitingList: countInvolved("Waiting List"),
      rejected: countInvolved("Rejected"),
    };
  }, [applications]);

  const items = [
    { label: "Total Applications", value: stats.total },
    { label: "Waiting", value: stats.waiting },
    { label: "Upcoming Exams", value: stats.upcomingExams },
    { label: "Admitted", value: stats.admitted },
    { label: "Waiting List", value: stats.waitingList },
    { label: "Rejected", value: stats.rejected },
  ];

  return (
    <section className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => (
        <div key={item.label} className="rounded-lg border border-gray-200 bg-white px-3 py-2">
          <div className="text-lg font-semibold text-gray-900">{item.value}</div>
          <div className="text-xs text-gray-500">{item.label}</div>
        </div>
      ))}
    </section>
  );
}
