import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validateApplication } from "@/lib/validation";

type RouteContext = { params: Promise<{ id: string }> };

function parseId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id: rawId } = await context.params;
  const id = parseId(rawId);
  if (id === null) {
    return NextResponse.json({ error: "Invalid application id." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const existing = await prisma.application.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  const { ok, errors, data } = validateApplication(body);
  if (!ok) {
    return NextResponse.json(
      { error: "Please fix the highlighted fields.", errors },
      { status: 400 }
    );
  }

  try {
    const application = await prisma.application.update({ where: { id }, data });
    return NextResponse.json({ application });
  } catch (error) {
    console.error("Failed to update application:", error);
    return NextResponse.json(
      { error: "Could not update the application. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id: rawId } = await context.params;
  const id = parseId(rawId);
  if (id === null) {
    return NextResponse.json({ error: "Invalid application id." }, { status: 400 });
  }

  const existing = await prisma.application.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  try {
    await prisma.application.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete application:", error);
    return NextResponse.json(
      { error: "Could not delete the application. Please try again." },
      { status: 500 }
    );
  }
}
