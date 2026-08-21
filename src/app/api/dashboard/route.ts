import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { activities, leads, projects, sales, units, users } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const [projectRows, unitRows, leadRows, saleRows, activityRows] = await Promise.all([
    db.select({ id: projects.id, name: projects.name, status: projects.status }).from(projects),
    db.select({ id: units.id, status: units.status, currentPrice: units.currentPrice, unitType: units.unitType }).from(units),
    db.select({ id: leads.id, status: leads.status, source: leads.source }).from(leads),
    db.select({ id: sales.id, netSaleValue: sales.netSaleValue, saleDate: sales.saleDate }).from(sales),
    db.select({ id: activities.id, action: activities.action, entityType: activities.entityType, createdAt: activities.createdAt, actor: users.name })
      .from(activities)
      .leftJoin(users, eq(activities.actorId, users.id))
      .orderBy(desc(activities.createdAt))
      .limit(8),
  ]);

  const unitStatuses = unitRows.reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = (acc[row.status] ?? 0) + 1;
    return acc;
  }, {});
  const totalInventory = unitRows.reduce((total, row) => total + Number(row.currentPrice), 0);
  const totalSales = saleRows.reduce((total, row) => total + Number(row.netSaleValue), 0);
  const activeDeals = leadRows.filter((row) => !["won", "lost"].includes(row.status)).length;
  const qualified = leadRows.filter((row) => ["qualified", "meeting", "viewing", "negotiation", "reservation", "won"].includes(row.status)).length;

  return Response.json({
    metrics: {
      totalProjects: projectRows.length,
      totalUnits: unitRows.length,
      availableUnits: unitStatuses.available ?? 0,
      reservedUnits: unitStatuses.reserved ?? 0,
      soldUnits: unitStatuses.sold ?? 0,
      totalInventory,
      totalSales,
      totalLeads: leadRows.length,
      activeDeals,
      conversionRate: leadRows.length ? Math.round((leadRows.filter((row) => row.status === "won").length / leadRows.length) * 100) : 0,
    },
    unitStatuses,
    projects: projectRows,
    activity: activityRows,
    unitTypes: Object.entries(unitRows.reduce<Record<string, number>>((acc, row) => {
      acc[row.unitType] = (acc[row.unitType] ?? 0) + 1;
      return acc;
    }, {})).map(([name, value]) => ({ name, value })),
    leadSources: Object.entries(leadRows.reduce<Record<string, number>>((acc, row) => {
      const key = row.source || "Unknown";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {})).map(([name, value]) => ({ name, value })),
    pipeline: { qualified, activeDeals },
  });
}
