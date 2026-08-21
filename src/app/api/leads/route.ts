import { and, asc, eq, ilike } from "drizzle-orm";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { activities, leads, projects, users } from "@/db/schema";
import { findCurrentUser } from "@/lib/seed";

export const dynamic = "force-dynamic";

const allowedStatuses = ["new", "contacted", "qualified", "meeting", "viewing", "negotiation", "reservation", "won", "lost"] as const;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const status = searchParams.get("status");
  const conditions = [
    search ? ilike(leads.fullName, `%${search}%`) : undefined,
    status ? eq(leads.status, status as (typeof allowedStatuses)[number]) : undefined,
  ].filter((value): value is NonNullable<typeof value> => Boolean(value));
  const rows = await db
    .select({
      id: leads.id,
      fullName: leads.fullName,
      phone: leads.phone,
      source: leads.source,
      budget: leads.budget,
      status: leads.status,
      priority: leads.priority,
      followUpDate: leads.followUpDate,
      notes: leads.notes,
      project: projects.name,
      agent: users.name,
      agentId: leads.assignedAgentId,
    })
    .from(leads)
    .leftJoin(projects, eq(leads.preferredProjectId, projects.id))
    .leftJoin(users, eq(leads.assignedAgentId, users.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(asc(leads.followUpDate));
  return Response.json({ leads: rows });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Record<string, unknown>;
  if (!body.fullName) return Response.json({ message: "Lead name is required" }, { status: 400 });
  const actor = await findCurrentUser();
  const [lead] = await db
    .insert(leads)
    .values({
      fullName: String(body.fullName),
      phone: body.phone ? String(body.phone) : null,
      whatsapp: body.whatsapp ? String(body.whatsapp) : null,
      email: body.email ? String(body.email) : null,
      source: body.source ? String(body.source) : "Manual entry",
      campaign: body.campaign ? String(body.campaign) : null,
      budget: body.budget ? String(body.budget) : null,
      preferredProjectId: body.preferredProjectId ? String(body.preferredProjectId) : null,
      preferredUnitType: body.preferredUnitType ? String(body.preferredUnitType) : null,
      assignedAgentId: body.assignedAgentId ? String(body.assignedAgentId) : actor?.id,
      status: "new",
      priority: body.priority === "high" || body.priority === "low" ? String(body.priority) : "medium",
      followUpDate: body.followUpDate ? String(body.followUpDate) : null,
      notes: body.notes ? String(body.notes) : null,
    })
    .returning();
  if (lead) await db.insert(activities).values({ actorId: actor?.id, entityType: "lead", entityId: lead.id, action: "created", newValue: { name: lead.fullName } });
  return Response.json({ lead }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = (await request.json()) as Record<string, unknown>;
  const status = String(body.status ?? "");
  if (!body.id || !allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
    return Response.json({ message: "Lead id and a valid status are required" }, { status: 400 });
  }
  const [lead] = await db.select().from(leads).where(eq(leads.id, String(body.id))).limit(1);
  if (!lead) return Response.json({ message: "Lead not found" }, { status: 404 });
  const actor = await findCurrentUser();
  await db.transaction(async (tx) => {
    await tx.update(leads).set({ status: status as (typeof allowedStatuses)[number], updatedAt: new Date() }).where(eq(leads.id, lead.id));
    await tx.insert(activities).values({ actorId: actor?.id, entityType: "lead", entityId: lead.id, action: "pipeline stage changed", oldValue: { status: lead.status }, newValue: { status } });
  });
  return Response.json({ ok: true });
}
