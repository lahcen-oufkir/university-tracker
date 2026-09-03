import Tracker from "@/components/Tracker";
import { prisma } from "@/lib/db";
import type { Application } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const rows = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
  });

  const applications: Application[] = rows.map((row) => ({
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }));

  return <Tracker initialApplications={applications} />;
}
