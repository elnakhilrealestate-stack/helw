import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { activities, priceHistory, units } from "@/db/schema";
import { findCurrentUser } from "@/lib/seed";

export const dynamic = "force-dynamic";

const allowedStatuses = ["available", "hold", "reserved", "contracted", "sold", "cancelled"] as const;
type UnitStatus = (typeof allowedStatuses)[number];

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = (await request.json()) as Record<string, unknown>;
  const [existing] = await db.select().from(units).where(eq(units.id, id)).limit(1);
  if (!existing) return Response.json({ message: "Unit not found" }, { status: 404 });

  const actor = await findCurrentUser();
  const requestedStatus = body.status ? String(body.status) : undefined;
  if (requestedStatus && !allowedStatuses.includes(requestedStatus as UnitStatus)) {
    return Response.json({ message: "Invalid unit status" }, { status: 400 });
  }
  if (requestedStatus === "reserved" && existing.status === "sold") {
    return Response.json({ message: "Sold units cannot be reserved" }, { status: 409 });
  }
  if (requestedStatus === "sold" && existing.status === "available") {
    return Response.json({ message: "Reserve or contract this unit before marking it sold" }, { status: 409 });
  }

  const nextPrice = body.currentPrice === undefined ? undefined : String(body.currentPrice);
  const patch = {
    status: requestedStatus as UnitStatus | undefined,
    currentPrice: nextPrice,
    paymentPlanId: body.paymentPlanId === undefined ? undefined : body.paymentPlanId ? String(body.paymentPlanId) : null,
    agentId: body.agentId === undefined ? undefined : body.agentId ? String(body.agentId) : null,
    notes: body.notes === undefined ? undefined : String(body.notes),
    updatedAt: new Date(),
  };

  const updated = await db.transaction(async (tx) => {
    const [unit] = await tx.update(units).set(patch).where(eq(units.id, id)).returning();
    if (requestedStatus && requestedStatus !== existing.status) {
      await tx.insert(activities).values({
        actorId: actor?.id,
        entityType: "unit",
        entityId: id,
        action: "status changed",
        oldValue: { status: existing.status },
        newValue: { status: requestedStatus, unitNumber: existing.unitNumber },
      });
    }
    if (nextPrice && nextPrice !== existing.currentPrice) {
      await tx.insert(priceHistory).values({
        unitId: id,
        oldPrice: existing.currentPrice,
        newPrice: nextPrice,
        reason: body.reason ? String(body.reason) : "Manual price update",
        changedById: actor?.id,
      });
      await tx.insert(activities).values({
        actorId: actor?.id,
        entityType: "price",
        entityId: id,
        action: "price changed",
        oldValue: { price: existing.currentPrice },
        newValue: { price: nextPrice, unitNumber: existing.unitNumber, reason: body.reason ?? "Manual price update" },
      });
    }
    return unit;
  });

  return Response.json({ unit: updated });
}
