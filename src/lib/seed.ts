import { eq } from "drizzle-orm";
import { db } from "@/db";
import {
  activities,
  buildings,
  customers,
  leads,
  paymentPlans,
  projects,
  reservations,
  sales,
  units,
  users,
} from "@/db/schema";

export async function seedDemoData() {
  const existing = await db.select({ id: projects.id }).from(projects).limit(1);
  if (existing.length) return { seeded: false, message: "Demo workspace already exists" };

  const people = await db
    .insert(users)
    .values([
      { name: "Maya El Sherif", email: "maya@valuey.demo", phone: "+20 100 321 1880", passwordHash: "demo-only-hash", role: "super_admin", avatarColor: "#C8A85A" },
      { name: "Omar Salah", email: "omar@valuey.demo", phone: "+20 100 918 3441", passwordHash: "demo-only-hash", role: "sales_manager", avatarColor: "#2E5D79" },
      { name: "Nour Hassan", email: "nour@valuey.demo", phone: "+20 111 708 2284", passwordHash: "demo-only-hash", role: "sales_agent", avatarColor: "#A66B4C" },
      { name: "Karim Adel", email: "karim@valuey.demo", phone: "+20 120 301 0448", passwordHash: "demo-only-hash", role: "sales_agent", avatarColor: "#56796D" },
      { name: "Lina Mostafa", email: "lina@valuey.demo", phone: "+20 101 452 9060", passwordHash: "demo-only-hash", role: "marketing", avatarColor: "#816E91" },
    ])
    .returning();
  const maya = people[0];
  const omar = people[1];
  const nour = people[2];
  const karim = people[3];
  if (!maya || !omar || !nour || !karim) throw new Error("Could not create demo users");

  const projectRows = await db
    .insert(projects)
    .values([
      {
        name: "Value 9 Mall",
        developer: "Al Qasr Developments",
        location: "9th District, Obour City",
        address: "Al Thaqafa Al Raeesy St, 9th District, Obour City",
        description: "A contemporary retail destination with flexible commercial spaces, premium street visibility and vibrant rooftop experiences.",
        projectType: "Retail & offices",
        status: "under_construction",
        deliveryDate: "2027-12-01",
        landArea: "6400",
        buildingsCount: 3,
        amenities: ["Rooftop coffee", "Direct street access", "24/7 security", "Smart parking"],
      },
      {
        name: "Sienna Gardens",
        developer: "Al Qasr Developments",
        location: "New Cairo",
        address: "Fifth Settlement, New Cairo",
        description: "An intimate residential community centred around landscaped courtyards and family-focused amenities.",
        projectType: "Residential",
        status: "under_construction",
        deliveryDate: "2028-06-01",
        landArea: "12800",
        buildingsCount: 6,
        amenities: ["Clubhouse", "Lagoons", "Kids area", "Gym"],
      },
    ])
    .returning();
  const value9 = projectRows[0];
  const sienna = projectRows[1];
  if (!value9 || !sienna) throw new Error("Could not create demo projects");

  const buildingRows = await db
    .insert(buildings)
    .values([
      { projectId: value9.id, name: "Value 9 Main", phase: "Commercial", floors: 3 },
      { projectId: value9.id, name: "Value 9 North", phase: "Commercial", floors: 2 },
      { projectId: sienna.id, name: "Garden Court A", phase: "Phase 1", floors: 5 },
      { projectId: sienna.id, name: "Garden Court B", phase: "Phase 1", floors: 5 },
    ])
    .returning();
  const mainBuilding = buildingRows[0];
  const northBuilding = buildingRows[1];
  const courtA = buildingRows[2];
  const courtB = buildingRows[3];
  if (!mainBuilding || !northBuilding || !courtA || !courtB) throw new Error("Could not create demo buildings");

  const plans = await db
    .insert(paymentPlans)
    .values([
      { projectId: value9.id, name: "10 / 10 / 70", downPaymentPercent: "10", installmentsCount: 96, frequency: "monthly", deliveryPercent: "10", description: "10% down, 10% after 3 months, then 70% over 8 years." },
      { projectId: value9.id, name: "20% over 5 years", downPaymentPercent: "20", installmentsCount: 60, frequency: "monthly", deliveryPercent: "0", description: "20% down payment and equal installments over 5 years." },
      { projectId: sienna.id, name: "15% over 7 years", downPaymentPercent: "15", installmentsCount: 84, frequency: "monthly", deliveryPercent: "5", description: "15% down payment with 5% on delivery." },
    ])
    .returning();
  const planA = plans[0];
  const planB = plans[1];
  const planC = plans[2];
  if (!planA || !planB || !planC) throw new Error("Could not create payment plans");

  const valueUnitRows = Array.from({ length: 86 }, (_, index) => {
    const n = index + 1;
    const floor = n <= 23 ? "Ground" : n <= 52 ? "First" : "Second";
    const area = n <= 16 ? 47 + (n % 3) : n <= 44 ? 51 + (n % 5) : 23 + (n % 5) * 2;
    const priceSqm = n <= 52 ? 125000 : n <= 70 ? 110000 : 165000;
    const currentPrice = area * priceSqm;
    const status = n % 13 === 0 ? "sold" : n % 9 === 0 ? "reserved" : n % 17 === 0 ? "hold" : "available";
    return {
      projectId: value9.id,
      buildingId: n % 4 === 0 ? northBuilding.id : mainBuilding.id,
      paymentPlanId: n % 3 === 0 ? planB.id : planA.id,
      agentId: n % 3 === 0 ? karim.id : n % 2 === 0 ? nour.id : omar.id,
      unitNumber: n <= 23 ? `G${n}-V9` : n <= 52 ? `F${n - 23}-V9` : `S${n - 52}-V9`,
      phase: "Commercial",
      floor,
      unitType: n % 5 === 0 ? "Office" : n % 6 === 0 ? "Restaurant" : "Retail",
      bedrooms: 0,
      bathrooms: 1,
      area: String(area),
      gardenArea: "0",
      terraceArea: n % 7 === 0 ? "12" : "0",
      view: n % 4 === 0 ? "Main street" : n % 3 === 0 ? "Plaza" : "Boulevard",
      orientation: n % 2 === 0 ? "North" : "East",
      parking: n > 52 ? 1 : 0,
      status,
      basePrice: String(currentPrice),
      currentPrice: String(currentPrice),
      discountPercent: n % 10 === 0 ? "10" : "0",
      bookingFee: "50000",
      maintenanceFee: String(Math.round(currentPrice * 0.07)),
      commissionPercent: "2.5",
      notes: n % 9 === 0 ? "Priority follow-up requested" : null,
    } as const;
  });

  const gardenUnitRows = Array.from({ length: 38 }, (_, index) => {
    const n = index + 1;
    const area = 118 + (n % 4) * 22;
    const currentPrice = area * 68000;
    const status = n % 11 === 0 ? "sold" : n % 8 === 0 ? "reserved" : "available";
    return {
      projectId: sienna.id,
      buildingId: n % 2 === 0 ? courtA.id : courtB.id,
      paymentPlanId: planC.id,
      agentId: n % 2 === 0 ? nour.id : karim.id,
      unitNumber: `SG-${String(n).padStart(3, "0")}`,
      phase: "Phase 1",
      floor: n <= 8 ? "Garden" : `Level ${Math.ceil(n / 8)}`,
      unitType: n % 4 === 0 ? "Townhouse" : "Apartment",
      bedrooms: n % 4 === 0 ? 4 : n % 2 === 0 ? 3 : 2,
      bathrooms: n % 4 === 0 ? 4 : 3,
      area: String(area),
      gardenArea: n <= 8 ? "45" : "0",
      terraceArea: "12",
      view: n % 2 === 0 ? "Garden" : "Lagoon",
      orientation: "South",
      parking: 2,
      status,
      basePrice: String(currentPrice),
      currentPrice: String(currentPrice),
      discountPercent: "0",
      bookingFee: "75000",
      maintenanceFee: String(Math.round(currentPrice * 0.08)),
      commissionPercent: "2.5",
      notes: null,
    } as const;
  });
  const insertedUnits = await db.insert(units).values([...valueUnitRows, ...gardenUnitRows]).returning();

  const customerRows = await db
    .insert(customers)
    .values([
      { fullName: "Hassan Mansour", phone: "+20 101 213 8742", whatsapp: "+20 101 213 8742", email: "hassan.mansour@example.com", notes: "Interested in a premium street-facing retail space." },
      { fullName: "Salma Nabil", phone: "+20 109 442 1180", whatsapp: "+20 109 442 1180", email: "salma.nabil@example.com", notes: "Wants payment plan comparison before signing." },
      { fullName: "Ahmed Badr", phone: "+20 120 552 3671", email: "ahmed.badr@example.com", notes: "Investor, referred by existing client." },
      { fullName: "Dalia Farouk", phone: "+20 111 343 9045", email: "dalia.farouk@example.com", notes: "Family buyer for Sienna Gardens." },
    ])
    .returning();
  const hassan = customerRows[0];
  const salma = customerRows[1];
  const ahmed = customerRows[2];
  if (!hassan || !salma || !ahmed) throw new Error("Could not create demo customers");

  await db.insert(leads).values([
    { fullName: "Youssef Tarek", phone: "+20 101 587 9224", whatsapp: "+20 101 587 9224", source: "Meta ads", campaign: "Value 9 Launch", budget: "6500000", preferredProjectId: value9.id, preferredUnitType: "Retail", preferredArea: "45–60 sqm", assignedAgentId: nour.id, status: "new", priority: "high", followUpDate: "2026-08-14", notes: "Asked for the first floor price list." },
    { fullName: "Nadine Fathy", phone: "+20 109 933 1470", source: "Website", campaign: "Organic", budget: "4200000", preferredProjectId: value9.id, preferredUnitType: "Office", preferredArea: "25–35 sqm", assignedAgentId: karim.id, status: "qualified", priority: "medium", followUpDate: "2026-08-12", notes: "Viewing scheduled for Thursday." },
    { fullName: "Mohamed Samir", phone: "+20 122 642 0039", source: "Referral", campaign: "Partners", budget: "11000000", preferredProjectId: sienna.id, preferredUnitType: "Townhouse", preferredArea: "160 sqm", assignedAgentId: nour.id, status: "viewing", priority: "high", followUpDate: "2026-08-13", notes: "Referred by Hassan Mansour." },
    { fullName: "Reem Magdy", phone: "+20 100 771 8631", source: "Walk-in", campaign: "Onsite", budget: "3300000", preferredProjectId: value9.id, preferredUnitType: "Retail", preferredArea: "23 sqm", assignedAgentId: karim.id, status: "negotiation", priority: "high", followUpDate: "2026-08-11", notes: "Reviewing 10% cash discount." },
    { fullName: "Khaled Riad", phone: "+20 114 122 9933", source: "Instagram", campaign: "Sienna summer", budget: "9500000", preferredProjectId: sienna.id, preferredUnitType: "Apartment", preferredArea: "140 sqm", assignedAgentId: nour.id, status: "contacted", priority: "low", followUpDate: "2026-08-15", notes: "Requested a brochure on WhatsApp." },
    { fullName: "Farida Amin", phone: "+20 102 101 5440", source: "Meta ads", campaign: "Value 9 Launch", budget: "5800000", preferredProjectId: value9.id, preferredUnitType: "Retail", preferredArea: "50 sqm", assignedAgentId: omar.id, status: "reservation", priority: "high", followUpDate: "2026-08-10", notes: "Booking fee expected today." },
  ]);

  const reservedUnit = insertedUnits.find((unit) => unit.status === "reserved");
  const soldUnit = insertedUnits.find((unit) => unit.status === "sold");
  const soldUnit2 = insertedUnits.filter((unit) => unit.status === "sold")[1];
  if (reservedUnit) {
    await db.insert(reservations).values({ customerId: hassan.id, unitId: reservedUnit.id, agentId: nour.id, reservationDate: "2026-08-04", expiryDate: "2026-08-18", amount: "100000", status: "active", notes: "Awaiting signed reservation form." });
  }
  if (soldUnit) {
    await db.insert(sales).values({ customerId: salma.id, unitId: soldUnit.id, agentId: karim.id, paymentPlanId: planA.id, saleDate: "2026-07-28", contractValue: soldUnit.currentPrice, discount: "0", netSaleValue: soldUnit.currentPrice, contractStatus: "signed" });
  }
  if (soldUnit2) {
    await db.insert(sales).values({ customerId: ahmed.id, unitId: soldUnit2.id, agentId: nour.id, paymentPlanId: planB.id, saleDate: "2026-07-20", contractValue: soldUnit2.currentPrice, discount: "200000", netSaleValue: String(Number(soldUnit2.currentPrice) - 200000), contractStatus: "signed" });
  }

  await db.insert(activities).values([
    { actorId: nour.id, entityType: "lead", action: "created", newValue: { name: "Youssef Tarek", source: "Meta ads" } },
    { actorId: karim.id, entityType: "reservation", action: "reserved unit", newValue: { unit: reservedUnit?.unitNumber ?? "F5-V9", customer: "Hassan Mansour" } },
    { actorId: omar.id, entityType: "price", action: "updated pricing", oldValue: { price: 3240000 }, newValue: { price: 2916000, unit: "F5-V9" } },
    { actorId: maya.id, entityType: "customer", action: "created", newValue: { customer: "Dalia Farouk" } },
  ]);

  return { seeded: true, message: "Value 9 Mall demo workspace created" };
}

export async function findCurrentUser() {
  const [user] = await db.select().from(users).where(eq(users.role, "super_admin")).limit(1);
  return user;
}
