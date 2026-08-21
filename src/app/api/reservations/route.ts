import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { activities, reservations, units } from "@/db/schema";
import { findCurrentUser } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Record<string, unknown>;
  if (!body.customerId || !body.unitId || !body.expiryDate || !body.amount) {
    return Response.json({ message: "Customer, unit, expiry date and amount are required" }, { status: 400 });
  }
  const actor = await findCurrentUser();

  try {
    const reservation = await db.transaction(async (tx) => {
      const [unit] = await tx.select().from(units).where(eq(units.id, String(body.unitId))).limit(1);
      if (!unit) throw new Error("UNIT_NOT_FOUND");
      if (unit.status === "sold") throw new Error("UNIT_SOLD");
      if (unit.status !== "available" && unit.status !== "hold") throw new Error("UNIT_UNAVAILABLE");

      const [created] = await tx
        .insert(reservations)
        .values({
          customerId: String(body.customerId),
          unitId: unit.id,
          agentId: body.agentId ? String(body.agentId) : actor?.id,
          reservationDate: new Date().toISOString().slice(0, 10),
          expiryDate: String(body.expiryDate),
          amount: String(body.amount),
          status: "active",
          notes: body.notes ? String(body.notes) : null,
        })
        .returning();
      await tx.update(units).set({ status: "reserved", updatedAt: new Date() }).where(eq(units.id, unit.id));
      await tx.insert(activities).values({
        actorId: actor?.id,
        entityType: "reservation",
        entityId: created?.id,
        action: "unit reserved",
        oldValue: { unitStatus: unit.status },
        newValue: { unitNumber: unit.unitNumber, status: "reserved", expiryDate: body.expiryDate },
      });
      return created;
    });
    return Response.json({ reservation }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create reservation";
    const messages: Record<string, string> = {
      UNIT_NOT_FOUND: "Unit not found",
      UNIT_SOLD: "Sold units cannot be reserved",
      UNIT_UNAVAILABLE: "This unit is not currently available for reservation",
    };
    return Response.json({ message: messages[message] ?? "Unable to create reservation" }, { status: 409 });
  }
}

export async function PATCH(request: NextRequest) {
  const body = (await request.json()) as Record<string, unknown>;
  if (!body.id || !body.status) return Response.json({ message: "Reservation id and status are required" }, { status: 400 });
  const [reservation] = await db.select().from(reservations).where(eq(reservations.id, String(body.id))).limit(1);
  if (!reservation) return Response.json({ message: "Reservation not found" }, { status: 404 });
  const actor = await findCurrentUser();
  const status = String(body.status);
  await db.transaction(async (tx) => {
    await tx.update(reservations).set({ status: status as "pending" | "active" | "converted" | "expired" | "cancelled" }).where(eq(reservations.id, reservation.id));
    if (status === "expired" || status === "cancelled") {
      await tx.update(units).set({ status: "available", updatedAt: new Date() }).where(eq(units.id, reservation.unitId));
    }
    await tx.insert(activities).values({ actorId: actor?.id, entityType: "reservation", entityId: reservation.id, action: "status changed", oldValue: { status: reservation.status }, newValue: { status } });
  });
  return Response.json({ ok: true });
}
