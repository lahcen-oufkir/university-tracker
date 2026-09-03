import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validateApplication } from "@/lib/validation";

export async function GET() {
  const applications = await prisma.application.findMany({
    orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ applications });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { ok, errors, data } = validateApplication(body);
  if (!ok) {
    return NextResponse.json(
      { error: "Please fix the highlighted fields.", errors },
      { status: 400 }
    );
  }

  try {
    const application = await prisma.application.create({ data });
    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error("Failed to create application:", error);
    return NextResponse.json(
      { error: "Could not save the application. Please try again." },
      { status: 500 }
    );
  }
}
