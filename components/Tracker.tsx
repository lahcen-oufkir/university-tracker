"use client";

import { useMemo, useState } from "react";
import ApplicationForm from "@/components/ApplicationForm";
import ApplicationTable from "@/components/ApplicationTable";
import ConfirmDialog from "@/components/ConfirmDialog";
import Filters from "@/components/Filters";
import Stats from "@/components/Stats";
import type { Application, ApplicationInput } from "@/lib/types";

interface FormState {
  mode: "create" | "edit";
  application?: Application;
}

export default function Tracker({ initialApplications }: { initialApplications: Application[] }) {
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [form, setForm] = useState<FormState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null);
  const [deleting, setDeleting] = useState(false);

  const cities = useMemo(
    () =>
      Array.from(new Set(applications.map((a) => a.city))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [applications]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return applications.filter((a) => {
      if (statusFilter !== "All" && a.status !== statusFilter) return false;
      if (levelFilter !== "All" && a.level !== levelFilter) return false;
      if (cityFilter !== "All" && a.city !== cityFilter) return false;
      if (!query) return true;
      return [a.school, a.city, a.program, a.notes].some((value) =>
        value?.toLowerCase().includes(query)
      );
    });
  }, [applications, search, statusFilter, levelFilter, cityFilter]);

  async function saveApplication(input: ApplicationInput, id?: number) {
    const response = await fetch(id ? `/api/applications/${id}` : "/api/applications", {
      method: id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok || !payload?.application) {
      throw payload ?? { error: "Something went wrong. Please try again." };
    }
    const saved: Application = payload.application;
    setApplications((previous) =>
      id ? previous.map((a) => (a.id === id ? saved : a)) : [...previous, saved]
    );
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleting(true);
    const response = await fetch(`/api/applications/${target.id}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteTarget(null);
    if (!response.ok) {
      window.alert("Could not delete this application. Please try again.");
      return;
    }
    setApplications((previous) => previous.filter((a) => a.id !== target.id));
  }

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900">
            University Application Tracker
          </h1>
          <p className="text-sm text-gray-500">Track your school applications in Morocco</p>
        </div>
        <button
          type="button"
          onClick={() => setForm({ mode: "create" })}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
        >
          + Add Application
        </button>
      </header>

      <Stats applications={applications} />

      <Filters
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
        level={levelFilter}
        onLevelChange={setLevelFilter}
        city={cityFilter}
        onCityChange={setCityFilter}
        cities={cities}
      />

      <ApplicationTable
        applications={filtered}
        totalCount={applications.length}
        onEdit={(application) => setForm({ mode: "edit", application })}
        onDelete={(application) => setDeleteTarget(application)}
      />

      {form && (
        <ApplicationForm
          key={form.application?.id ?? "create"}
          initial={form.application ?? null}
          onCancel={() => setForm(null)}
          onSave={async (input) => {
            await saveApplication(input, form.application?.id);
            setForm(null);
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete application"
          message={`Are you sure you want to delete this application? (${deleteTarget.school})`}
          busy={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </main>
  );
}
