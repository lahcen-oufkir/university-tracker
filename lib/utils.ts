const MS_PER_DAY = 86_400_000;

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
}

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function daysUntil(iso: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [year, month, day] = iso.split("-").map(Number);
  const target = new Date(year, (month ?? 1) - 1, day ?? 1);
  if (Number.isNaN(target.getTime())) return null;
  return Math.round((target.getTime() - startOfToday().getTime()) / MS_PER_DAY);
}

export interface DeadlineWarning {
  tone: "normal" | "warn" | "danger" | "expired";
  label: string;
}

export function deadlineWarning(iso: string | null): DeadlineWarning | null {
  if (!iso) return null;
  const days = daysUntil(iso);
  if (days === null) return null;
  if (days < 0) return { tone: "expired", label: "Expired" };
  if (days === 0) return { tone: "danger", label: "Due today" };
  if (days <= 2) return { tone: "danger", label: `In ${days} day${days === 1 ? "" : "s"}` };
  if (days <= 7) return { tone: "warn", label: `In ${days} days` };
  return { tone: "normal", label: `In ${days} days` };
}

export function examWarning(iso: string | null): string | null {
  if (!iso) return null;
  const days = daysUntil(iso);
  if (days === null || days < 0 || days > 7) return null;
  if (days === 0) return "Exam today";
  return `Exam in ${days} day${days === 1 ? "" : "s"}`;
}
