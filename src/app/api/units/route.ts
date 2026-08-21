import { and, asc, eq, gte, ilike, lte } from "drizzle-orm";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { buildings, paymentPlans, projects, units, users } from "@/db/schema";
import { findCurrentUser } from "@/lib/seed";

export const dynamic = "force-dynamic";

function numberParam(value: string | null) {
  if (!value || Number.isNaN(Number(value))) return undefined;
  return String(Number(value));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const project = searchParams.get("project");
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const type = searchParams.get("type");
  const minPrice = numberParam(searchParams.get("minPrice"));
  const maxPrice = numberParam(searchParams.get("maxPrice"));
  const minArea = numberParam(searchParams.get("minArea"));
  const maxArea = numberParam(searchParams.get("maxArea"));

  const conditions = [
    project ? eq(units.projectId, project) : undefined,
    status ? eq(units.status, status as (typeof units.status.enumValues)[number]) : undefined,
    type ? eq(units.unitType, type) : undefined,
    search ? ilike(units.unitNumber, `%${search}%`) : undefined,
    minPrice ? gte(units.currentPrice, minPrice) : undefined,
    maxPrice ? lte(units.currentPrice, maxPrice) : undefined,
    minArea ? gte(units.area, minArea) : undefined,
    maxArea ? lte(units.area, maxArea) : undefined,
  ].filter(Boolean);

  const rows = await db
    .select({
      id: units.id,
      unitNumber: units.unitNumber,
      phase: units.phase,
      floor: units.floor,
      unitType: units.unitType,
      bedrooms: units.bedrooms,
      bathrooms: units.bathrooms,
      area: units.area,
      view: units.view,
      status: units.status,
      basePrice: units.basePrice,
      currentPrice: units.currentPrice,
      discountPercent: units.discountPercent,
      paymentPlanId: units.paymentPlanId,
      projectId: units.projectId,
      project: projects.name,
      building: buildings.name,
      plan: paymentPlans.name,
      agent: users.name,
    })
    .from(units)
    .leftJoin(projects, eq(units.projectId, projects.id))
    .leftJoin(buildings, eq(units.buildingId, buildings.id))
    .leftJoin(paymentPlans, eq(units.paymentPlanId, paymentPlans.id))
    .leftJoin(users, eq(units.agentId, users.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(asc(units.unitNumber));

  return Response.json({ units: rows, total: rows.length });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Record<string, unknown>;
  const required = ["projectId", "unitNumber", "unitType", "area", "basePrice", "currentPrice"];
  const missing = required.filter((field) => !body[field]);
  if (missing.length) return Response.json({ message: `Missing ${missing.join(", ")}` }, { status: 400 });

  const [created] = await db
    .insert(units)
    .values({
      projectId: String(body.projectId),
      buildingId: body.buildingId ? String(body.buildingId) : null,
      paymentPlanId: body.paymentPlanId ? String(body.paymentPlanId) : null,
      unitNumber: String(body.unitNumber).trim(),
      phase: body.phase ? String(body.phase) : "Main Phase",
      floor: body.floor ? String(body.floor) : null,
      unitType: String(body.unitType),
      bedrooms: Number(body.bedrooms ?? 0),
      bathrooms: Number(body.bathrooms ?? 0),
      area: String(body.area),
      view: body.view ? String(body.view) : null,
      status: "available",
      basePrice: String(body.basePrice),
      currentPrice: String(body.currentPrice),
      bookingFee: String(body.bookingFee ?? 0),
      maintenanceFee: String(body.maintenanceFee ?? 0),
    })
    .returning();
  const actor = await findCurrentUser();
  if (created) {
    const { activities } = await import("@/db/schema");
    await db.insert(activities).values({ actorId: actor?.id, entityType: "unit", entityId: created.id, action: "created", newValue: { unitNumber: created.unitNumber } });
  }
  return Response.json({ unit: created }, { status: 201 });
}
