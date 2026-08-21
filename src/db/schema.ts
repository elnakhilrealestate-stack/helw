import {
  boolean,
  date,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", [
  "super_admin",
  "admin",
  "sales_manager",
  "sales_agent",
  "accountant",
  "marketing",
]);
export const projectStatusEnum = pgEnum("project_status", ["planning", "under_construction", "delivered", "archived"]);
export const unitStatusEnum = pgEnum("unit_status", ["available", "hold", "reserved", "contracted", "sold", "cancelled"]);
export const leadStatusEnum = pgEnum("lead_status", ["new", "contacted", "qualified", "meeting", "viewing", "negotiation", "reservation", "won", "lost"]);
export const reservationStatusEnum = pgEnum("reservation_status", ["pending", "active", "converted", "expired", "cancelled"]);
export const commissionStatusEnum = pgEnum("commission_status", ["pending", "approved", "paid", "cancelled"]);
export const documentKindEnum = pgEnum("document_kind", ["project", "unit", "customer", "reservation", "sale", "contract"]);

const id = () => uuid("id").defaultRandom().primaryKey();
const createdAt = () => timestamp("created_at", { withTimezone: true }).defaultNow().notNull();

export const users = pgTable("users", {
  id: id(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  phone: varchar("phone", { length: 40 }),
  role: userRoleEnum("role").notNull().default("sales_agent"),
  avatarColor: varchar("avatar_color", { length: 12 }).default("#C7A85A"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: createdAt(),
});

export const projects = pgTable("projects", {
  id: id(),
  name: varchar("name", { length: 180 }).notNull(),
  developer: varchar("developer", { length: 180 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  address: text("address"),
  description: text("description"),
  projectType: varchar("project_type", { length: 80 }).notNull(),
  status: projectStatusEnum("status").notNull().default("planning"),
  deliveryDate: date("delivery_date"),
  landArea: numeric("land_area", { precision: 12, scale: 2 }),
  buildingsCount: integer("buildings_count").notNull().default(0),
  amenities: jsonb("amenities").$type<string[]>().default([]),
  imageUrl: text("image_url"),
  archivedAt: timestamp("archived_at", { withTimezone: true }),
  createdAt: createdAt(),
});

export const buildings = pgTable("buildings", {
  id: id(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 120 }).notNull(),
  phase: varchar("phase", { length: 80 }).default("Main Phase"),
  floors: integer("floors").notNull().default(1),
  createdAt: createdAt(),
});

export const paymentPlans = pgTable("payment_plans", {
  id: id(),
  projectId: uuid("project_id").references(() => projects.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 140 }).notNull(),
  downPaymentPercent: numeric("down_payment_percent", { precision: 5, scale: 2 }).notNull(),
  installmentsCount: integer("installments_count").notNull(),
  frequency: varchar("frequency", { length: 24 }).notNull().default("monthly"),
  deliveryPercent: numeric("delivery_percent", { precision: 5, scale: 2 }).notNull().default("0"),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: createdAt(),
});

export const units = pgTable("units", {
  id: id(),
  projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  buildingId: uuid("building_id").references(() => buildings.id, { onDelete: "set null" }),
  paymentPlanId: uuid("payment_plan_id").references(() => paymentPlans.id, { onDelete: "set null" }),
  agentId: uuid("agent_id").references(() => users.id, { onDelete: "set null" }),
  unitNumber: varchar("unit_number", { length: 80 }).notNull().unique(),
  phase: varchar("phase", { length: 80 }).default("Main Phase"),
  floor: varchar("floor", { length: 40 }),
  unitType: varchar("unit_type", { length: 80 }).notNull(),
  bedrooms: integer("bedrooms").notNull().default(0),
  bathrooms: integer("bathrooms").notNull().default(0),
  area: numeric("area", { precision: 12, scale: 2 }).notNull(),
  gardenArea: numeric("garden_area", { precision: 12, scale: 2 }).default("0"),
  terraceArea: numeric("terrace_area", { precision: 12, scale: 2 }).default("0"),
  view: varchar("view", { length: 100 }),
  orientation: varchar("orientation", { length: 40 }),
  parking: integer("parking").notNull().default(0),
  status: unitStatusEnum("status").notNull().default("available"),
  basePrice: numeric("base_price", { precision: 16, scale: 2 }).notNull(),
  currentPrice: numeric("current_price", { precision: 16, scale: 2 }).notNull(),
  discountPercent: numeric("discount_percent", { precision: 5, scale: 2 }).notNull().default("0"),
  bookingFee: numeric("booking_fee", { precision: 16, scale: 2 }).notNull().default("0"),
  maintenanceFee: numeric("maintenance_fee", { precision: 16, scale: 2 }).notNull().default("0"),
  commissionPercent: numeric("commission_percent", { precision: 5, scale: 2 }).notNull().default("2.5"),
  notes: text("notes"),
  createdAt: createdAt(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const priceHistory = pgTable("price_history", {
  id: id(),
  unitId: uuid("unit_id").notNull().references(() => units.id, { onDelete: "cascade" }),
  oldPrice: numeric("old_price", { precision: 16, scale: 2 }).notNull(),
  newPrice: numeric("new_price", { precision: 16, scale: 2 }).notNull(),
  reason: text("reason"),
  changedById: uuid("changed_by_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
});

export const customers = pgTable("customers", {
  id: id(),
  fullName: varchar("full_name", { length: 180 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  whatsapp: varchar("whatsapp", { length: 40 }),
  email: varchar("email", { length: 255 }),
  nationalId: varchar("national_id", { length: 80 }),
  address: text("address"),
  notes: text("notes"),
  createdAt: createdAt(),
});

export const leads = pgTable("leads", {
  id: id(),
  fullName: varchar("full_name", { length: 180 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  whatsapp: varchar("whatsapp", { length: 40 }),
  email: varchar("email", { length: 255 }),
  source: varchar("source", { length: 100 }),
  campaign: varchar("campaign", { length: 140 }),
  budget: numeric("budget", { precision: 16, scale: 2 }),
  preferredProjectId: uuid("preferred_project_id").references(() => projects.id, { onDelete: "set null" }),
  preferredUnitType: varchar("preferred_unit_type", { length: 80 }),
  preferredArea: varchar("preferred_area", { length: 120 }),
  assignedAgentId: uuid("assigned_agent_id").references(() => users.id, { onDelete: "set null" }),
  status: leadStatusEnum("status").notNull().default("new"),
  priority: varchar("priority", { length: 20 }).notNull().default("medium"),
  notes: text("notes"),
  followUpDate: date("follow_up_date"),
  createdAt: createdAt(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const reservations = pgTable("reservations", {
  id: id(),
  customerId: uuid("customer_id").notNull().references(() => customers.id, { onDelete: "restrict" }),
  unitId: uuid("unit_id").notNull().references(() => units.id, { onDelete: "restrict" }),
  agentId: uuid("agent_id").references(() => users.id, { onDelete: "set null" }),
  reservationDate: date("reservation_date").notNull(),
  expiryDate: date("expiry_date").notNull(),
  amount: numeric("amount", { precision: 16, scale: 2 }).notNull(),
  status: reservationStatusEnum("status").notNull().default("pending"),
  notes: text("notes"),
  createdAt: createdAt(),
});

export const sales = pgTable("sales", {
  id: id(),
  customerId: uuid("customer_id").notNull().references(() => customers.id, { onDelete: "restrict" }),
  unitId: uuid("unit_id").notNull().references(() => units.id, { onDelete: "restrict" }),
  agentId: uuid("agent_id").references(() => users.id, { onDelete: "set null" }),
  paymentPlanId: uuid("payment_plan_id").references(() => paymentPlans.id, { onDelete: "set null" }),
  saleDate: date("sale_date").notNull(),
  contractValue: numeric("contract_value", { precision: 16, scale: 2 }).notNull(),
  discount: numeric("discount", { precision: 16, scale: 2 }).notNull().default("0"),
  netSaleValue: numeric("net_sale_value", { precision: 16, scale: 2 }).notNull(),
  contractStatus: varchar("contract_status", { length: 40 }).notNull().default("draft"),
  createdAt: createdAt(),
});

export const paymentInstallments = pgTable("payment_installments", {
  id: id(),
  saleId: uuid("sale_id").notNull().references(() => sales.id, { onDelete: "cascade" }),
  installmentNo: integer("installment_no").notNull(),
  dueDate: date("due_date").notNull(),
  amount: numeric("amount", { precision: 16, scale: 2 }).notNull(),
  status: varchar("status", { length: 30 }).notNull().default("pending"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
});

export const commissions = pgTable("commissions", {
  id: id(),
  saleId: uuid("sale_id").notNull().references(() => sales.id, { onDelete: "cascade" }),
  agentId: uuid("agent_id").notNull().references(() => users.id, { onDelete: "restrict" }),
  percentage: numeric("percentage", { precision: 5, scale: 2 }).notNull(),
  amount: numeric("amount", { precision: 16, scale: 2 }).notNull(),
  status: commissionStatusEnum("status").notNull().default("pending"),
  dueDate: date("due_date"),
  paidDate: date("paid_date"),
  createdAt: createdAt(),
});

export const documents = pgTable("documents", {
  id: id(),
  kind: documentKindEnum("kind").notNull(),
  entityId: uuid("entity_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: varchar("file_type", { length: 30 }),
  uploadedById: uuid("uploaded_by_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: createdAt(),
});

export const activities = pgTable("activities", {
  id: id(),
  actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
  entityType: varchar("entity_type", { length: 80 }).notNull(),
  entityId: uuid("entity_id"),
  action: varchar("action", { length: 120 }).notNull(),
  oldValue: jsonb("old_value"),
  newValue: jsonb("new_value"),
  createdAt: createdAt(),
});

export const notifications = pgTable("notifications", {
  id: id(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 180 }).notNull(),
  body: text("body"),
  type: varchar("type", { length: 60 }).notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: createdAt(),
});
