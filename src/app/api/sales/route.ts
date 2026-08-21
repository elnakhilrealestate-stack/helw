import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { db } from "@/db";
import { activities, commissions, paymentInstallments, paymentPlans, reservations, sales, units } from "@/db/schema";
import { findCurrentUser } from "@/lib/seed";

export const dynamic = "force-dynamic";

function addMonths(date: Date, amount: number) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + amount);
  return result.toISOString().slice(0, 10);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Record<string, unknown>;
  if (!body.customerId || !body.unitId || !body.paymentPlanId) {
    return Response.json({ message: "Customer, unit and payment plan are required" }, { status: 400 });
  }
  const actor = await findCurrentUser();

  try {
    const result = await db.transaction(async (tx) => {
      const [unit] = await tx.select().from(units).where(eq(units.id, String(body.unitId))).limit(1);
      const [plan] = await tx.select().from(paymentPlans).where(eq(paymentPlans.id, String(body.paymentPlanId))).limit(1);
      if (!unit || !plan) throw new Error("INVALID_SALE_INPUT");
      if (unit.status === "sold") throw new Error("UNIT_SOLD");
      if (unit.status !== "reserved" && unit.status !== "contracted") throw new Error("UNIT_NOT_RESERVED");

      const contractValue = Number(body.contractValue ?? unit.currentPrice);
      const discount = Number(body.discount ?? 0);
      const netSaleValue = contractValue - discount;
      const [sale] = await tx
        .insert(sales)
        .values({
          customerId: String(body.customerId),
          unitId: unit.id,
          agentId: body.agentId ? String(body.agentId) : unit.agentId,
          paymentPlanId: plan.id,
          saleDate: new Date().toISOString().slice(0, 10),
          contractValue: String(contractValue),
          discount: String(discount),
          netSaleValue: String(netSaleValue),
          contractStatus: "signed",
        })
        .returning();
      if (!sale) throw new Error("SALE_CREATE_FAILED");

      const downPercent = Number(plan.downPaymentPercent);
      const deliveryPercent = Number(plan.deliveryPercent);
      const financedBalance = netSaleValue * (1 - (downPercent + deliveryPercent) / 100);
      const installmentAmount = financedBalance / plan.installmentsCount;
      const today = new Date();
      await tx.insert(paymentInstallments).values([
        { saleId: sale.id, installmentNo: 0, dueDate: today.toISOString().slice(0, 10), amount: String((netSaleValue * downPercent) / 100), status: "pending" },
        ...Array.from({ length: plan.installmentsCount }, (_, index) => ({
          saleId: sale.id,
          installmentNo: index + 1,
          dueDate: addMonths(today, index + 1),
          amount: String(installmentAmount),
          status: "pending",
        })),
      ]);
      if (deliveryPercent > 0) {
        await tx.insert(paymentInstallments).values({ saleId: sale.id, installmentNo: plan.installmentsCount + 1, dueDate: addMonths(today, plan.installmentsCount), amount: String((netSaleValue * deliveryPercent) / 100), status: "pending" });
      }

      const commissionPercent = Number(unit.commissionPercent);
      if (unit.agentId) {
        await tx.insert(commissions).values({ saleId: sale.id, agentId: unit.agentId, percentage: String(commissionPercent), amount: String((netSaleValue * commissionPercent) / 100), status: "pending", dueDate: addMonths(today, 1) });
      }
      await tx.update(units).set({ status: "sold", updatedAt: new Date() }).where(eq(units.id, unit.id));
      await tx.update(reservations).set({ status: "converted" }).where(eq(reservations.unitId, unit.id));
      await tx.insert(activities).values({ actorId: actor?.id, entityType: "sale", entityId: sale.id, action: "sale completed", oldValue: { unitStatus: unit.status }, newValue: { unitNumber: unit.unitNumber, contractValue, commissionPercent } });
      return { sale, installmentCount: plan.installmentsCount + 1 + (deliveryPercent > 0 ? 1 : 0) };
    });
    return Response.json(result, { status: 201 });
  } catch (error) {
    const code = error instanceof Error ? error.message : "";
    const messages: Record<string, string> = {
      INVALID_SALE_INPUT: "The unit or payment plan could not be found",
      UNIT_SOLD: "This unit has already been sold",
      UNIT_NOT_RESERVED: "A unit must be reserved or contracted before a sale is completed",
    };
    return Response.json({ message: messages[code] ?? "Unable to complete sale" }, { status: 409 });
  }
}
