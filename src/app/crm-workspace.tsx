"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Activity,
  ArrowDownToLine,
  ArrowUpRight,
  BarChart3,
  Bell,
  Building2,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Clock3,
  ContactRound,
  CreditCard,
  Download,
  FileText,
  Filter,
  Grid2X2,
  HandCoins,
  House,
  LayoutDashboard,
  ListFilter,
  Loader2,
  LockKeyhole,
  MapPin,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Target,
  UsersRound,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const salesChart = [
  { month: "Mar", sales: 2.1, target: 2.8 },
  { month: "Apr", sales: 3.4, target: 3.1 },
  { month: "May", sales: 2.8, target: 3.5 },
  { month: "Jun", sales: 4.2, target: 3.8 },
  { month: "Jul", sales: 5.1, target: 4.2 },
  { month: "Aug", sales: 4.7, target: 4.6 },
];

const fallbackUnits: Unit[] = [
  { id: "demo-1", unitNumber: "G1-V9", project: "Value 9 Mall", projectId: "value9", building: "Value 9 Main", floor: "Ground", unitType: "Retail", bedrooms: 0, bathrooms: 1, area: "57", view: "Boulevard", status: "available", basePrice: "11115000", currentPrice: "11115000", discountPercent: "0", plan: "10 / 10 / 70", agent: "Omar Salah" },
  { id: "demo-2", unitNumber: "G5-V9", project: "Value 9 Mall", projectId: "value9", building: "Value 9 Main", floor: "Ground", unitType: "Retail", bedrooms: 0, bathrooms: 1, area: "51", view: "Main street", status: "reserved", basePrice: "9435000", currentPrice: "9435000", discountPercent: "0", plan: "20% over 5 years", agent: "Nour Hassan" },
  { id: "demo-3", unitNumber: "F5-V9", project: "Value 9 Mall", projectId: "value9", building: "Value 9 North", floor: "First", unitType: "Office", bedrooms: 0, bathrooms: 1, area: "27", view: "Plaza", status: "sold", basePrice: "3240000", currentPrice: "2916000", discountPercent: "10", plan: "10 / 10 / 70", agent: "Karim Adel" },
  { id: "demo-4", unitNumber: "F14-V9", project: "Value 9 Mall", projectId: "value9", building: "Value 9 Main", floor: "First", unitType: "Retail", bedrooms: 0, bathrooms: 1, area: "51", view: "Boulevard", status: "available", basePrice: "6375000", currentPrice: "6375000", discountPercent: "0", plan: "10 / 10 / 70", agent: "Nour Hassan" },
  { id: "demo-5", unitNumber: "S6-V9", project: "Value 9 Mall", projectId: "value9", building: "Value 9 Main", floor: "Second", unitType: "Restaurant", bedrooms: 0, bathrooms: 2, area: "73", view: "Main street", status: "hold", basePrice: "12045000", currentPrice: "12045000", discountPercent: "0", plan: "20% over 5 years", agent: "Omar Salah" },
  { id: "demo-6", unitNumber: "SG-008", project: "Sienna Gardens", projectId: "sienna", building: "Garden Court A", floor: "Garden", unitType: "Apartment", bedrooms: 3, bathrooms: 3, area: "140", view: "Garden", status: "available", basePrice: "9520000", currentPrice: "9520000", discountPercent: "0", plan: "15% over 7 years", agent: "Nour Hassan" },
  { id: "demo-7", unitNumber: "SG-011", project: "Sienna Gardens", projectId: "sienna", building: "Garden Court B", floor: "Level 2", unitType: "Townhouse", bedrooms: 4, bathrooms: 4, area: "184", view: "Lagoon", status: "reserved", basePrice: "12512000", currentPrice: "12512000", discountPercent: "0", plan: "15% over 7 years", agent: "Karim Adel" },
  { id: "demo-8", unitNumber: "G18-V9", project: "Value 9 Mall", projectId: "value9", building: "Value 9 Main", floor: "Ground", unitType: "Retail", bedrooms: 0, bathrooms: 1, area: "51", view: "Main street", status: "available", basePrice: "9435000", currentPrice: "9435000", discountPercent: "0", plan: "10 / 10 / 70", agent: "Omar Salah" },
];

const fallbackLeads: Lead[] = [
  { id: "l1", fullName: "Youssef Tarek", phone: "+20 101 587 9224", source: "Meta ads", budget: "6500000", status: "new", priority: "high", followUpDate: "2026-08-14", project: "Value 9 Mall", agent: "Nour Hassan", agentId: null, notes: "Asked for the first floor price list." },
  { id: "l2", fullName: "Nadine Fathy", phone: "+20 109 933 1470", source: "Website", budget: "4200000", status: "qualified", priority: "medium", followUpDate: "2026-08-12", project: "Value 9 Mall", agent: "Karim Adel", agentId: null, notes: "Viewing scheduled for Thursday." },
  { id: "l3", fullName: "Mohamed Samir", phone: "+20 122 642 0039", source: "Referral", budget: "11000000", status: "viewing", priority: "high", followUpDate: "2026-08-13", project: "Sienna Gardens", agent: "Nour Hassan", agentId: null, notes: "Referred by Hassan Mansour." },
  { id: "l4", fullName: "Reem Magdy", phone: "+20 100 771 8631", source: "Walk-in", budget: "3300000", status: "negotiation", priority: "high", followUpDate: "2026-08-11", project: "Value 9 Mall", agent: "Karim Adel", agentId: null, notes: "Reviewing 10% cash discount." },
  { id: "l5", fullName: "Farida Amin", phone: "+20 102 101 5440", source: "Meta ads", budget: "5800000", status: "reservation", priority: "high", followUpDate: "2026-08-10", project: "Value 9 Mall", agent: "Omar Salah", agentId: null, notes: "Booking fee expected today." },
];

type Unit = {
  id: string;
  unitNumber: string;
  project: string | null;
  projectId: string;
  building: string | null;
  floor: string | null;
  unitType: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  view: string | null;
  status: string;
  basePrice: string;
  currentPrice: string;
  discountPercent: string;
  plan: string | null;
  agent: string | null;
};

type Lead = {
  id: string;
  fullName: string;
  phone: string | null;
  source: string | null;
  budget: string | null;
  status: string;
  priority: string;
  followUpDate: string | null;
  project: string | null;
  agent: string | null;
  agentId: string | null;
  notes: string | null;
};

type MetricData = {
  totalProjects: number;
  totalUnits: number;
  availableUnits: number;
  reservedUnits: number;
  soldUnits: number;
  totalInventory: number;
  totalSales: number;
  totalLeads: number;
  activeDeals: number;
  conversionRate: number;
};

type DashboardData = {
  metrics: MetricData;
  unitStatuses: Record<string, number>;
  projects: { id: string; name: string; status: string }[];
  activity: { id: string; action: string; entityType: string; createdAt: string; actor: string | null }[];
  unitTypes: { name: string; value: number }[];
  leadSources: { name: string; value: number }[];
};

const icons = {
  dashboard: LayoutDashboard,
  projects: Building2,
  availability: Grid2X2,
  pricing: CircleDollarSign,
  customers: ContactRound,
  leads: Target,
  sales: HandCoins,
  reservations: CalendarClock,
  payments: CreditCard,
  commissions: HandCoins,
  team: UsersRound,
  documents: FileText,
  reports: BarChart3,
  settings: Settings,
};

type ViewName = "dashboard" | "projects" | "availability" | "pricing" | "customers" | "leads" | "sales" | "reservations" | "payments" | "commissions" | "team" | "documents" | "reports" | "settings";

const navigation: { label: string; id: ViewName; icon: keyof typeof icons; divider?: boolean }[] = [
  { label: "Dashboard", id: "dashboard", icon: "dashboard" },
  { label: "Projects", id: "projects", icon: "projects", divider: true },
  { label: "Units & Availability", id: "availability", icon: "availability" },
  { label: "Pricing", id: "pricing", icon: "pricing" },
  { label: "Customers", id: "customers", icon: "customers", divider: true },
  { label: "Leads & CRM", id: "leads", icon: "leads" },
  { label: "Sales", id: "sales", icon: "sales" },
  { label: "Reservations", id: "reservations", icon: "reservations" },
  { label: "Payment Plans", id: "payments", icon: "payments" },
  { label: "Commissions", id: "commissions", icon: "commissions", divider: true },
  { label: "Agents & Team", id: "team", icon: "team" },
  { label: "Documents", id: "documents", icon: "documents" },
  { label: "Reports", id: "reports", icon: "reports" },
  { label: "Settings", id: "settings", icon: "settings", divider: true },
];

const statusStyle: Record<string, string> = {
  available: "badge-available",
  reserved: "badge-reserved",
  sold: "badge-sold",
  hold: "badge-hold",
  contracted: "badge-contracted",
  cancelled: "badge-cancelled",
  new: "badge-new",
  qualified: "badge-qualified",
  viewing: "badge-viewing",
  negotiation: "badge-negotiation",
  reservation: "badge-reserved",
  contacted: "badge-contacted",
  meeting: "badge-viewing",
  won: "badge-sold",
  lost: "badge-cancelled",
};

const statusNames: Record<string, string> = {
  available: "Available", reserved: "Reserved", sold: "Sold", hold: "On hold", contracted: "Contracted", cancelled: "Cancelled",
  new: "New", contacted: "Contacted", qualified: "Qualified", meeting: "Meeting", viewing: "Viewing", negotiation: "Negotiation", reservation: "Reservation", won: "Won", lost: "Lost",
};

const pieColors = ["#C9A85C", "#2E637D", "#9C6B50", "#728A72", "#A07186", "#54647A"];

function money(value: string | number, compact = false) {
  const amount = Number(value || 0);
  if (compact && amount >= 1_000_000) return `EGP ${(amount / 1_000_000).toFixed(amount >= 10_000_000 ? 0 : 1)}M`;
  return new Intl.NumberFormat("en-EG", { style: "currency", currency: "EGP", maximumFractionDigits: 0 }).format(amount);
}

function initials(name?: string | null) {
  return (name || "U").split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
}

function StatusBadge({ value }: { value: string }) {
  return <span className={`status-badge ${statusStyle[value] || "badge-new"}`}><i />{statusNames[value] || value}</span>;
}

function MetricCard({ label, value, change, icon: Icon, tone = "gold" }: { label: string; value: string; change?: string; icon: typeof Building2; tone?: "gold" | "blue" | "green" | "slate" }) {
  return <article className="metric-card">
    <div className={`metric-icon metric-${tone}`}><Icon size={19} strokeWidth={1.8} /></div>
    <div className="metric-copy">
      <p>{label}</p>
      <strong>{value}</strong>
      {change && <span className="metric-change"><ArrowUpRight size={13} /> {change}</span>}
    </div>
  </article>;
}

function SectionTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="section-title">
    <div>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {description && <p className="section-description">{description}</p>}
    </div>
    {action}
  </div>;
}

export default function CrmWorkspace() {
  const [view, setView] = useState<ViewName>("availability");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unitsData, setUnitsData] = useState<Unit[]>(fallbackUnits);
  const [leadsData, setLeadsData] = useState<Lead[]>(fallbackLeads);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [priceMode, setPriceMode] = useState(false);
  const [priceDraft, setPriceDraft] = useState("");
  const [newUnitOpen, setNewUnitOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [draggedLead, setDraggedLead] = useState<string | null>(null);

  const refresh = async () => {
    try {
      const [unitsResponse, leadsResponse, dashboardResponse] = await Promise.all([
        fetch("/api/units", { cache: "no-store" }),
        fetch("/api/leads", { cache: "no-store" }),
        fetch("/api/dashboard", { cache: "no-store" }),
      ]);
      if (unitsResponse.ok) {
        const data = await unitsResponse.json() as { units: Unit[] };
        if (data.units.length) setUnitsData(data.units);
      }
      if (leadsResponse.ok) {
        const data = await leadsResponse.json() as { leads: Lead[] };
        if (data.leads.length) setLeadsData(data.leads);
      }
      if (dashboardResponse.ok) setDashboard(await dashboardResponse.json() as DashboardData);
    } catch {
      setToast("Showing the workspace preview while data loads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const boot = async () => {
      try { await fetch("/api/bootstrap", { method: "POST" }); } catch { /* API fallback is intentional */ }
      await refresh();
    };
    void boot();
  }, []);

  const filteredUnits = useMemo(() => unitsData.filter((unit) => {
    const matchSearch = [unit.unitNumber, unit.project, unit.building, unit.agent].join(" ").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || unit.status === statusFilter;
    const matchProject = projectFilter === "all" || unit.projectId === projectFilter || unit.project === projectFilter;
    return matchSearch && matchStatus && matchProject;
  }), [unitsData, search, statusFilter, projectFilter]);

  const metrics: MetricData = dashboard?.metrics || {
    totalProjects: 2, totalUnits: 124, availableUnits: 92, reservedUnits: 14, soldUnits: 11,
    totalInventory: 875_000_000, totalSales: 89_400_000, totalLeads: 42, activeDeals: 19, conversionRate: 24,
  };

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  };

  const toggleUnit = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const updateUnit = async (id: string, payload: Record<string, unknown>, success: string) => {
    const response = await fetch(`/api/units/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const result = await response.json() as { message?: string };
    if (!response.ok) return showToast(result.message || "This change could not be applied.");
    await refresh();
    const updated = unitsData.find((unit) => unit.id === id);
    if (updated) setSelectedUnit({ ...updated, ...payload } as Unit);
    setPriceMode(false);
    showToast(success);
  };

  const updateLead = async (id: string, status: string) => {
    setLeadsData((current) => current.map((lead) => lead.id === id ? { ...lead, status } : lead));
    const response = await fetch("/api/leads", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (!response.ok) {
      await refresh();
      return showToast("Unable to move this lead. The pipeline was restored.");
    }
    showToast("Lead stage updated and logged in CRM activity.");
  };

  const createUnit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const projectId = String(form.get("projectId") || dashboard?.projects[0]?.id || "");
    const payload = Object.fromEntries(form.entries());
    const response = await fetch("/api/units", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, projectId, currentPrice: payload.basePrice }) });
    const result = await response.json() as { message?: string };
    if (!response.ok) return showToast(result.message || "Unit could not be created.");
    setNewUnitOpen(false);
    await refresh();
    showToast("New unit created and added to availability.");
  };

  const bulkStatus = async (status: string) => {
    if (!selected.length) return showToast("Select at least one unit before applying a bulk action.");
    await Promise.all(selected.map((id) => fetch(`/api/units/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) })));
    setSelected([]);
    await refresh();
    showToast(`Availability updated for ${selected.length} selected units.`);
  };

  const renderContent = () => {
    if (view === "dashboard") return <DashboardView metrics={metrics} dashboard={dashboard} setView={setView} />;
    if (view === "availability") return <AvailabilityView
      units={filteredUnits} totalUnits={unitsData.length} metrics={metrics} search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter}
      projectFilter={projectFilter} setProjectFilter={setProjectFilter} projects={dashboard?.projects || []} selected={selected} toggleUnit={toggleUnit}
      toggleAll={() => setSelected(selected.length === filteredUnits.length ? [] : filteredUnits.map((unit) => unit.id))} onUnit={setSelectedUnit} onNew={() => setNewUnitOpen(true)} onBulk={bulkStatus}
    />;
    if (view === "leads") return <LeadsView leads={leadsData} draggedLead={draggedLead} setDraggedLead={setDraggedLead} moveLead={updateLead} />;
    if (view === "projects") return <ProjectsView metrics={metrics} projects={dashboard?.projects || []} setView={setView} />;
    if (view === "payments") return <PaymentPlansView />;
    if (view === "reports") return <ReportsView metrics={metrics} />;
    if (view === "pricing") return <PricingView units={unitsData.slice(0, 5)} onUnit={setSelectedUnit} />;
    if (view === "team") return <TeamView />;
    return <OperationsView view={view} setView={setView} />;
  };

  return <main className="crm-shell">
    <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
      <div className="brand">
        <div className="brand-mark"><span /></div>
        <div><strong>value<span>Y</span></strong><em>real estate OS</em></div>
        <button className="mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><X size={18} /></button>
      </div>
      <div className="workspace-select"><span className="workspace-badge">V9</span><div><b>Value 9 workspace</b><small>Al Qasr Developments</small></div><ChevronDown size={15} /></div>
      <nav className="main-nav" aria-label="Main navigation">
        {navigation.map((item) => {
          const Icon = icons[item.icon];
          return <div className={item.divider ? "nav-divider-group" : ""} key={item.id}>
            {item.divider && <span className="nav-rule" />}
            <button className={`nav-item ${view === item.id ? "nav-active" : ""}`} onClick={() => { setView(item.id); setSidebarOpen(false); }}>
              <Icon size={17} strokeWidth={1.8} /> <span>{item.label}</span>
              {item.id === "leads" && <b className="nav-count">4</b>}
            </button>
          </div>;
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="storage-meter"><div><span>Workspace storage</span><b>62%</b></div><i><em /></i><small>6.2 GB of 10 GB used</small></div>
        <div className="profile-row"><div className="avatar avatar-maya">ME</div><div><b>Maya El Sherif</b><small>Super Admin</small></div><MoreHorizontal size={18} /></div>
      </div>
    </aside>
    <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />

    <section className="content-shell">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={20} /></button>
        <div className="breadcrumb"><span>Value 9 Mall</span><ChevronRight size={14} /><b>{navigation.find((item) => item.id === view)?.label}</b></div>
        <div className="topbar-actions">
          <label className="global-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search units, customers, leads..." /><kbd>⌘ K</kbd></label>
          <button className="icon-button notification-button" aria-label="Notifications"><Bell size={19} /><span>3</span></button>
          <button className="help-button">?</button>
        </div>
      </header>
      <div className="page-content">{renderContent()}</div>
    </section>

    {selectedUnit && <UnitDrawer unit={selectedUnit} onClose={() => { setSelectedUnit(null); setPriceMode(false); }} onPrice={() => { setPriceDraft(selectedUnit.currentPrice); setPriceMode(true); }} priceMode={priceMode} priceDraft={priceDraft} setPriceDraft={setPriceDraft} onSavePrice={() => void updateUnit(selectedUnit.id, { currentPrice: priceDraft, reason: "Pricing review" }, "Price updated with a complete audit record.")} onStatus={(status) => void updateUnit(selectedUnit.id, { status }, `Unit marked ${statusNames[status]?.toLowerCase() || status}.`)} />}
    {newUnitOpen && <NewUnitModal projects={dashboard?.projects || []} onClose={() => setNewUnitOpen(false)} onSubmit={createUnit} />}
    {loading && <div className="loading-line"><i /></div>}
    {toast && <div className="toast"><Check size={16} />{toast}</div>}
  </main>;
}

function DashboardView({ metrics, dashboard, setView }: { metrics: MetricData; dashboard: DashboardData | null; setView: (view: ViewName) => void }) {
  const statuses = Object.entries(dashboard?.unitStatuses || { available: metrics.availableUnits, reserved: metrics.reservedUnits, sold: metrics.soldUnits, hold: 7 }).map(([name, value]) => ({ name: statusNames[name] || name, value }));
  return <>
    <SectionTitle eyebrow="Tuesday, 12 August 2026" title="Good morning, Maya" description="Here’s what’s moving across your real estate portfolio today." action={<button className="button button-primary" onClick={() => setView("availability")}><Grid2X2 size={17} />Open availability</button>} />
    <div className="metrics-grid dashboard-metrics">
      <MetricCard label="Total inventory" value={money(metrics.totalInventory, true)} change="12.4% this month" icon={Building2} tone="gold" />
      <MetricCard label="Available units" value={String(metrics.availableUnits)} change="74% of stock" icon={Grid2X2} tone="blue" />
      <MetricCard label="Active deals" value={String(metrics.activeDeals)} change="6 need follow-up" icon={Target} tone="green" />
      <MetricCard label="Monthly revenue" value={money(4_700_000, true)} change="18.2% vs. July" icon={CircleDollarSign} tone="slate" />
    </div>
    <div className="dashboard-grid">
      <section className="panel sales-panel"><div className="panel-heading"><div><h2>Sales momentum</h2><p>Net sales value · last 6 months</p></div><button className="text-button">View report <ArrowUpRight size={15} /></button></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={salesChart} margin={{ top: 10, right: 5, left: -26, bottom: 0 }}><defs><linearGradient id="salesArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#C9A85C" stopOpacity=".26" /><stop offset="100%" stopColor="#C9A85C" stopOpacity="0" /></linearGradient></defs><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#87929d", fontSize: 12 }} dy={8} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#87929d", fontSize: 12 }} tickFormatter={(value) => `${value}M`} /><Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E7E9E5", boxShadow: "0 8px 24px rgba(18,37,50,.08)" }} formatter={(value) => [`EGP ${value}M`, "Sales"]} /><Area type="monotone" dataKey="sales" stroke="#C9A85C" strokeWidth={2.5} fill="url(#salesArea)" /><Area type="monotone" dataKey="target" stroke="#95A3AD" strokeDasharray="5 5" strokeWidth={1.5} fill="transparent" /></AreaChart></ResponsiveContainer></div></section>
      <section className="panel status-panel"><div className="panel-heading"><div><h2>Units by status</h2><p>Across all active projects</p></div><button className="round-more"><MoreHorizontal size={18} /></button></div><div className="donut-layout"><div className="donut"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statuses} dataKey="value" nameKey="name" innerRadius={53} outerRadius={73} paddingAngle={4} stroke="none">{statuses.map((_, index) => <Cell key={index} fill={pieColors[index]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="donut-center"><strong>{metrics.totalUnits}</strong><span>units</span></div></div><div className="mini-legend">{statuses.slice(0, 4).map((item, index) => <div key={item.name}><i style={{ background: pieColors[index] }} /><span>{item.name}</span><b>{item.value}</b></div>)}</div></div></section>
      <section className="panel activity-panel"><div className="panel-heading"><div><h2>Recent activity</h2><p>Every change is automatically audited</p></div><button className="text-button">Audit log <ArrowUpRight size={15} /></button></div><div className="activity-list">{(dashboard?.activity || [
        { id: "a1", actor: "Nour Hassan", action: "created a new lead", entityType: "lead", createdAt: new Date().toISOString() },
        { id: "a2", actor: "Karim Adel", action: "reserved F5-V9", entityType: "reservation", createdAt: new Date().toISOString() },
        { id: "a3", actor: "Omar Salah", action: "updated pricing for G18-V9", entityType: "price", createdAt: new Date().toISOString() },
      ]).slice(0, 5).map((item, index) => <div className="activity-item" key={item.id}><div className={`activity-icon activity-${item.entityType}`}><Activity size={15} /></div><div><p><b>{item.actor || "System"}</b> {item.action}</p><small>{index === 0 ? "12 min ago" : `${index + 1} hours ago`}</small></div></div>)}</div></section>
      <section className="panel source-panel"><div className="panel-heading"><div><h2>Leads by source</h2><p>Qualified lead acquisition</p></div></div><div className="source-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={dashboard?.leadSources || [{ name: "Meta ads", value: 16 }, { name: "Referral", value: 10 }, { name: "Website", value: 9 }, { name: "Walk-in", value: 7 }]} layout="vertical" margin={{ left: -20, right: 10, top: 0, bottom: 0 }}><XAxis type="number" hide /><YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#63717d", fontSize: 12 }} width={75} /><Tooltip cursor={{ fill: "#F7F5F0" }} contentStyle={{ borderRadius: 12, border: "1px solid #E7E9E5" }} /><Bar dataKey="value" fill="#2E637D" radius={[0, 6, 6, 0]} barSize={12} /></BarChart></ResponsiveContainer></div></section>
    </div>
  </>;
}

function AvailabilityView({ units, totalUnits, metrics, search, setSearch, statusFilter, setStatusFilter, projectFilter, setProjectFilter, projects, selected, toggleUnit, toggleAll, onUnit, onNew, onBulk }: {
  units: Unit[]; totalUnits: number; metrics: MetricData; search: string; setSearch: (value: string) => void; statusFilter: string; setStatusFilter: (value: string) => void; projectFilter: string; setProjectFilter: (value: string) => void; projects: { id: string; name: string; status: string }[]; selected: string[]; toggleUnit: (id: string) => void; toggleAll: () => void; onUnit: (unit: Unit) => void; onNew: () => void; onBulk: (status: string) => void;
}) {
  return <>
    <SectionTitle eyebrow="Inventory command center" title="Units & Availability" description={`${totalUnits} active units across 2 projects · last synced just now`} action={<div className="title-actions"><button className="button button-subtle"><ArrowDownToLine size={17} />Import</button><button className="button button-primary" onClick={onNew}><Plus size={17} />Add unit</button></div>} />
    <section className="availability-hero">
      <div className="hero-project"><div className="hero-logo"><span>V</span><i /></div><div><p>Featured project</p><h2>Value 9 Mall</h2><span><MapPin size={14} />9th District, Obour City</span></div><button>Project details <ChevronRight size={16} /></button></div>
      <div className="hero-statuses"><div><span>Available</span><b>{metrics.availableUnits}</b><i className="status-line available-line" /></div><div><span>Reserved</span><b>{metrics.reservedUnits}</b><i className="status-line reserved-line" /></div><div><span>Sold</span><b>{metrics.soldUnits}</b><i className="status-line sold-line" /></div><div><span>Inventory value</span><b>{money(metrics.totalInventory, true)}</b><i className="status-line inventory-line" /></div></div>
    </section>
    <section className="panel inventory-panel">
      <div className="inventory-tabs"><div><button className="active-tab"><ListFilter size={16} />Availability table</button><button><Grid2X2 size={16} />Floor plan</button><button><BarChart3 size={16} />Availability analytics</button></div><p><span className="sync-dot" /> Live inventory</p></div>
      <div className="filter-toolbar">
        <label className="table-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search unit number, agent or building" /></label>
        <select value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)}><option value="all">All projects</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="all">All statuses</option><option value="available">Available</option><option value="hold">On hold</option><option value="reserved">Reserved</option><option value="contracted">Contracted</option><option value="sold">Sold</option></select>
        <button className="filter-button"><SlidersHorizontal size={16} />More filters <span>3</span></button>
        <div className="toolbar-spacer" />
        <button className="icon-button export-button" title="Export selected units"><Download size={17} /></button>
      </div>
      {selected.length > 0 && <div className="bulk-bar"><span><b>{selected.length}</b> unit{selected.length > 1 ? "s" : ""} selected</span><button onClick={() => onBulk("available")}>Mark available</button><button onClick={() => onBulk("hold")}>Put on hold</button><button>Assign plan</button><button className="bulk-cancel" onClick={() => toggleAll()}>Clear</button></div>}
      <div className="table-scroll"><table className="availability-table"><thead><tr><th><input type="checkbox" aria-label="Select all units" checked={selected.length > 0 && selected.length === units.length} onChange={toggleAll} /></th><th>Unit <span>↕</span></th><th>Building / floor</th><th>Type</th><th>Area</th><th>View</th><th>Status</th><th>Current price <span>↕</span></th><th>Price / sqm</th><th>Payment plan</th><th>Agent</th><th /></tr></thead><tbody>{units.slice(0, 10).map((unit) => <tr key={unit.id} className={selected.includes(unit.id) ? "selected-row" : ""}><td><input type="checkbox" aria-label={`Select ${unit.unitNumber}`} checked={selected.includes(unit.id)} onChange={() => toggleUnit(unit.id)} /></td><td><button className="unit-link" onClick={() => onUnit(unit)}>{unit.unitNumber}</button><small>{unit.project}</small></td><td><b>{unit.building || "—"}</b><small>{unit.floor || "—"}</small></td><td><b>{unit.unitType}</b><small>{unit.bedrooms ? `${unit.bedrooms} BR · ${unit.bathrooms} bath` : "Commercial"}</small></td><td><b>{Number(unit.area).toLocaleString()} sqm</b></td><td><span className="view-cell">{unit.view || "—"}</span></td><td><StatusBadge value={unit.status} /></td><td><b>{money(unit.currentPrice)}</b>{Number(unit.discountPercent) > 0 && <small className="discount-text">{unit.discountPercent}% cash off</small>}</td><td><b>{money(Number(unit.currentPrice) / Number(unit.area))}</b></td><td><span className="plan-pill">{unit.plan || "Unassigned"}</span></td><td><div className="agent-cell"><span className="tiny-avatar">{initials(unit.agent)}</span><span>{unit.agent || "Unassigned"}</span></div></td><td><button className="row-more" onClick={() => onUnit(unit)} aria-label={`Open ${unit.unitNumber}`}><MoreHorizontal size={18} /></button></td></tr>)}{units.length === 0 && <tr><td colSpan={12}><div className="empty-table"><Search size={22} /><b>No matching units</b><p>Try clearing a filter or search for another unit.</p></div></td></tr>}</tbody></table></div>
      <footer className="table-footer"><p>Showing <b>{Math.min(10, units.length)}</b> of <b>{units.length}</b> filtered units</p><div><button disabled><ChevronLeft size={16} /></button><button className="page-active">1</button><button>2</button><button>3</button><button><ChevronRight size={16} /></button></div></footer>
    </section>
  </>;
}

function UnitDrawer({ unit, onClose, onPrice, priceMode, priceDraft, setPriceDraft, onSavePrice, onStatus }: { unit: Unit; onClose: () => void; onPrice: () => void; priceMode: boolean; priceDraft: string; setPriceDraft: (value: string) => void; onSavePrice: () => void; onStatus: (status: string) => void }) {
  const pricePerSqm = Number(unit.currentPrice) / Number(unit.area);
  return <><div className="drawer-backdrop" onClick={onClose} /><aside className="unit-drawer"><div className="drawer-header"><div><p className="eyebrow">{unit.project}</p><h2>{unit.unitNumber}</h2><span>{unit.building} · {unit.floor}</span></div><button className="icon-button" onClick={onClose}><X size={18} /></button></div><div className="drawer-status"><StatusBadge value={unit.status} /><select value={unit.status} onChange={(event) => onStatus(event.target.value)}><option value="available">Available</option><option value="hold">On hold</option><option value="reserved">Reserved</option><option value="contracted">Contracted</option><option value="sold">Sold</option><option value="cancelled">Cancelled</option></select></div><div className="drawer-visual"><div className="blueprint-building"><span>{unit.unitNumber}</span><i /><i /><i /><i /><i /><i /></div><div><span>{unit.unitType}</span><b>{Number(unit.area)} sqm</b><small>{unit.view || "Premium view"} · {unit.bathrooms} bathroom</small></div></div><div className="drawer-section"><div className="drawer-section-heading"><h3>Commercial terms</h3><button onClick={onPrice}><CircleDollarSign size={15} />Edit price</button></div>{priceMode ? <div className="price-editor"><label>Current price <input type="number" value={priceDraft} onChange={(event) => setPriceDraft(event.target.value)} /></label><div><button className="button button-subtle" onClick={onClose}>Cancel</button><button className="button button-primary" onClick={onSavePrice}>Save change</button></div></div> : <div className="price-breakdown"><div><span>Base price</span><b>{money(unit.basePrice)}</b></div><div><span>Current price</span><b>{money(unit.currentPrice)}</b></div><div><span>Price per sqm</span><b>{money(pricePerSqm)}</b></div><div><span>Cash discount</span><b>{unit.discountPercent}%</b></div></div>}</div><div className="drawer-section"><div className="drawer-section-heading"><h3>Payment plan</h3><button>Change</button></div><div className="plan-detail"><div className="plan-schedule"><i>10%</i><span /><i>10%</i><span /><i>70%</i></div><div><b>{unit.plan || "No plan assigned"}</b><p>10% down payment · 10% after 3 months · balance over 8 years</p></div></div></div><div className="drawer-section"><div className="drawer-section-heading"><h3>Assigned agent</h3><button>Reassign</button></div><div className="assigned-agent"><span className="avatar avatar-nour">{initials(unit.agent)}</span><div><b>{unit.agent || "Not assigned"}</b><p>Sales consultant · 4 active units</p></div><Send size={17} /></div></div><div className="drawer-section"><div className="drawer-section-heading"><h3>Activity timeline</h3><button>View all</button></div><div className="drawer-timeline"><div><i className="timeline-gold" /><p><b>Pricing reviewed</b><span>EGP {Number(unit.currentPrice).toLocaleString()} current price · Today, 10:24</span></p></div><div><i className="timeline-blue" /><p><b>Availability verified</b><span>Status is {statusNames[unit.status]?.toLowerCase()} · Yesterday</span></p></div></div></div><div className="drawer-actions"><button className="button button-subtle"><FileText size={16} />Documents</button><button className="button button-primary" onClick={() => onStatus("reserved")} disabled={unit.status === "sold" || unit.status === "reserved"}><CalendarClock size={16} />Reserve unit</button></div></aside></>;
}

function NewUnitModal({ projects, onClose, onSubmit }: { projects: { id: string; name: string; status: string }[]; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="modal-layer"><div className="modal-backdrop" onClick={onClose} /><form className="new-unit-modal" onSubmit={onSubmit}><div className="modal-header"><div><p className="eyebrow">Availability inventory</p><h2>Add a unit</h2><span>Start with core commercial details. You can enrich it later.</span></div><button type="button" className="icon-button" onClick={onClose}><X size={18} /></button></div><div className="modal-grid"><label>Project<select name="projectId" required><option value="">Choose project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</select></label><label>Unit number<input name="unitNumber" required placeholder="e.g. F31-V9" /></label><label>Unit type<select name="unitType"><option>Retail</option><option>Office</option><option>Restaurant</option><option>Apartment</option><option>Townhouse</option></select></label><label>Building<input name="building" placeholder="Value 9 Main" /></label><label>Floor<input name="floor" placeholder="First" /></label><label>Area (sqm)<input name="area" required type="number" min="1" placeholder="51" /></label><label>Base price (EGP)<input name="basePrice" required type="number" min="0" placeholder="6375000" /></label><label>View<input name="view" placeholder="Boulevard" /></label></div><div className="modal-footer"><button type="button" className="button button-subtle" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit"><Plus size={16} />Create unit</button></div></form></div>;
}

function LeadsView({ leads, draggedLead, setDraggedLead, moveLead }: { leads: Lead[]; draggedLead: string | null; setDraggedLead: (value: string | null) => void; moveLead: (id: string, status: string) => void }) {
  const stages = ["new", "contacted", "qualified", "viewing", "negotiation", "reservation"];
  return <><SectionTitle eyebrow="Customer relationship management" title="Lead pipeline" description="Move cards between stages to update the CRM and notify the assigned agent." action={<div className="title-actions"><button className="button button-subtle"><Filter size={16} />Filters</button><button className="button button-primary"><Plus size={17} />Add lead</button></div>} /><div className="lead-summary"><div><Target size={17} /><span><b>{leads.length}</b> active leads</span></div><div><Clock3 size={17} /><span><b>6</b> follow-ups due today</span></div><div><Sparkles size={17} /><span><b>42%</b> qualified this month</span></div></div><div className="kanban-board">{stages.map((stage) => { const stageLeads = leads.filter((lead) => lead.status === stage); return <section className="kanban-column" key={stage} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (draggedLead) void moveLead(draggedLead, stage); setDraggedLead(null); }}><header><span><i className={`stage-dot stage-${stage}`} />{statusNames[stage]}</span><b>{stageLeads.length}</b><button><Plus size={15} /></button></header><div className="kanban-cards">{stageLeads.map((lead) => <article className="lead-card" key={lead.id} draggable onDragStart={() => setDraggedLead(lead.id)}><div className="lead-card-top"><span className={`priority priority-${lead.priority}`}><i />{lead.priority}</span><button><MoreHorizontal size={16} /></button></div><h3>{lead.fullName}</h3><p>{lead.project || "No project selected"}</p><div className="lead-budget">{lead.budget ? money(lead.budget, true) : "Budget pending"}</div><div className="lead-card-footer"><span className="tiny-avatar">{initials(lead.agent)}</span><span><CalendarClock size={13} />{lead.followUpDate ? "Aug 14" : "No follow-up"}</span></div></article>)}{stageLeads.length === 0 && <div className="drop-zone">Drop lead here</div>}</div></section>; })}</div></>;
}

function ProjectsView({ metrics, projects, setView }: { metrics: MetricData; projects: { id: string; name: string; status: string }[]; setView: (view: ViewName) => void }) {
  return <><SectionTitle eyebrow="Portfolio management" title="Projects" description="Explore performance, availability, documents and pricing for every development." action={<button className="button button-primary"><Plus size={17} />New project</button>} /><div className="project-summary"><MetricCard label="Active projects" value={String(metrics.totalProjects)} icon={Building2} tone="gold" /><MetricCard label="Total units" value={String(metrics.totalUnits)} icon={Grid2X2} tone="blue" /><MetricCard label="Portfolio value" value={money(metrics.totalInventory, true)} icon={CircleDollarSign} tone="green" /></div><div className="project-cards">{(projects.length ? projects : [{ id: "v9", name: "Value 9 Mall", status: "under_construction" }, { id: "sg", name: "Sienna Gardens", status: "under_construction" }]).map((project, index) => <article className="project-card" key={project.id}><div className={`project-image project-image-${index}`}><span>{index === 0 ? "V9" : "SG"}</span><div><StatusBadge value="contracted" /></div></div><div className="project-card-body"><div><h2>{project.name}</h2><p>{index === 0 ? "Retail & offices · 9th District, Obour City" : "Residential · Fifth Settlement, New Cairo"}</p></div><div className="project-mini-stats"><span><b>{index === 0 ? "86" : "38"}</b> units</span><span><b>{index === 0 ? "64" : "28"}</b> available</span><span><b>{index === 0 ? "2027" : "2028"}</b> delivery</span></div><button className="card-link" onClick={() => setView("availability")}>Open project dashboard <ArrowUpRight size={16} /></button></div></article>)}</div></>;
}

function PaymentPlansView() {
  const [price, setPrice] = useState(6375000);
  const installments = Math.round((price * 0.8) / 96);
  return <><SectionTitle eyebrow="Flexible financing" title="Payment plans" description="Build, compare and assign payment schedules to individual units or inventory groups." action={<button className="button button-primary"><Plus size={17} />Build payment plan</button>} /><div className="payment-layout"><section className="panel payment-builder"><div className="panel-heading"><div><h2>10 / 10 / 70</h2><p>Value 9 Mall · active plan</p></div><span className="active-label">Active</span></div><div className="payment-steps"><div><b>10%</b><span>Down payment</span><small>Today</small></div><i /><div><b>10%</b><span>Second payment</span><small>After 3 months</small></div><i /><div><b>70%</b><span>Installments</span><small>Over 8 years</small></div></div><div className="payment-table"><div><span>Booking fee</span><b>EGP 50,000</b></div><div><span>Installment frequency</span><b>Monthly · 96 payments</b></div><div><span>Delivery date</span><b>December 2027</b></div><div><span>Maintenance</span><b>7% of contract value</b></div></div></section><section className="panel plan-calculator"><div className="panel-heading"><div><h2>Plan calculator</h2><p>Preview a customer payment schedule</p></div></div><label>Contract value<input type="number" value={price} onChange={(event) => setPrice(Number(event.target.value))} /></label><div className="calculated-grid"><div><span>Down payment</span><b>{money(price * 0.1)}</b></div><div><span>2nd payment</span><b>{money(price * 0.1)}</b></div><div><span>Monthly installment</span><b>{money(installments)}</b></div><div><span>Total contract value</span><b>{money(price)}</b></div></div><button className="button button-primary full-button"><Send size={16} />Send schedule to customer</button></section></div><section className="panel plans-list"><div className="panel-heading"><div><h2>All plans</h2><p>3 active payment structures</p></div><button className="text-button">Manage plans <ArrowUpRight size={15} /></button></div><div className="plans-rows"><div><span className="plan-color gold" /><b>10 / 10 / 70</b><p>10% down · 10% after 3 months · 70% over 8 years</p><strong>62 units assigned</strong><button><MoreHorizontal size={18} /></button></div><div><span className="plan-color blue" /><b>20% over 5 years</b><p>20% down payment with monthly installments</p><strong>31 units assigned</strong><button><MoreHorizontal size={18} /></button></div><div><span className="plan-color green" /><b>15% over 7 years</b><p>15% down · 5% on delivery · balance over 7 years</p><strong>38 units assigned</strong><button><MoreHorizontal size={18} /></button></div></div></section></>;
}

function PricingView({ units, onUnit }: { units: Unit[]; onUnit: (unit: Unit) => void }) {
  return <><SectionTitle eyebrow="Pricing management" title="Live pricing desk" description="Review current values, discounts, price per sqm and the complete price-change history." action={<div className="title-actions"><button className="button button-subtle"><Download size={16} />Price list</button><button className="button button-primary"><Plus size={17} />Bulk price update</button></div>} /><div className="pricing-metrics"><MetricCard label="Average price / sqm" value="EGP 124,800" change="3.2% in 30 days" icon={CircleDollarSign} tone="gold" /><MetricCard label="Discounted units" value="14" icon={Target} tone="blue" /><MetricCard label="Pending approvals" value="3" icon={Clock3} tone="green" /></div><section className="panel price-history"><div className="panel-heading"><div><h2>Recent pricing activity</h2><p>Every price change is logged with its reason and user</p></div><button className="text-button">Price history <ArrowUpRight size={15} /></button></div>{units.map((unit, index) => <div className="price-row" key={unit.id}><div className="price-unit"><span className="price-icon"><CircleDollarSign size={16} /></span><div><b>{unit.unitNumber}</b><p>{unit.project} · {unit.unitType}</p></div></div><div><small>Previous</small><s>{money(Number(unit.currentPrice) * 1.08)}</s></div><div><small>New price</small><b>{money(unit.currentPrice)}</b></div><div><small>Reason</small><span>{index === 0 ? "Launch campaign adjustment" : "Floor premium update"}</span></div><div><small>Changed by</small><span>{unit.agent || "Maya El Sherif"}</span></div><button className="row-more" onClick={() => onUnit(unit)}><ChevronRight size={17} /></button></div>)}</section></>;
}

function TeamView() {
  const agents = [{ name: "Nour Hassan", leads: 18, sales: "EGP 18.4M", conversion: "31%", color: "#A66B4C" }, { name: "Karim Adel", leads: 15, sales: "EGP 15.8M", conversion: "27%", color: "#56796D" }, { name: "Omar Salah", leads: 12, sales: "EGP 11.2M", conversion: "24%", color: "#2E5D79" }];
  return <><SectionTitle eyebrow="People & performance" title="Agents & team" description="A live view of individual sales activity, capacity, conversion and commission." action={<button className="button button-primary"><Plus size={17} />Invite team member</button>} /><div className="team-header"><div><span className="team-icon"><UsersRound size={19} /></span><div><b>Sales team</b><p>5 active members · 45 open leads</p></div></div><button className="button button-subtle">Team settings</button></div><div className="agent-performance">{agents.map((agent, index) => <article className="agent-performance-card" key={agent.name}><div className="agent-card-head"><span className="avatar" style={{ background: agent.color }}>{initials(agent.name)}</span><div><h3>{agent.name}</h3><p>{index === 0 ? "Senior Sales Consultant" : "Sales Consultant"}</p></div><button><MoreHorizontal size={18} /></button></div><div className="agent-stat-grid"><div><span>Open leads</span><b>{agent.leads}</b></div><div><span>Sales value</span><b>{agent.sales}</b></div><div><span>Conversion</span><b>{agent.conversion}</b></div></div><div className="performance-bar"><span style={{ width: `${68 - index * 9}%` }} /></div><footer><span>Monthly target</span><b>{68 - index * 9}%</b></footer></article>)}</div><section className="panel team-bottom"><div className="panel-heading"><div><h2>Team performance</h2><p>Sales value compared with monthly target</p></div><button className="text-button">Detailed report <ArrowUpRight size={15} /></button></div><div className="team-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={[{ name: "Nour", value: 18.4, target: 16 }, { name: "Karim", value: 15.8, target: 16 }, { name: "Omar", value: 11.2, target: 12 }, { name: "Lina", value: 7.6, target: 8 }]} margin={{ left: -22, right: 8, top: 10 }}><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#66747f", fontSize: 12 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "#87929d", fontSize: 12 }} tickFormatter={(value) => `${value}M`} /><Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E7E9E5" }} /><Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} /><Bar dataKey="value" name="Sales" fill="#C9A85C" radius={[6, 6, 0, 0]} /><Bar dataKey="target" name="Target" fill="#DCE4E7" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></section></>;
}

function ReportsView({ metrics }: { metrics: MetricData }) {
  const reportList = [["Availability report", "Live inventory by project, floor and status", Grid2X2], ["Sales report", "Contracts, discounts and net sales value", HandCoins], ["Lead performance", "Sources, stages and conversion", Target], ["Commission report", "Due, approved and paid agent commission", CircleDollarSign], ["Price changes", "Detailed pricing history and approvals", Activity], ["Payment collection", "Installment schedules and upcoming payments", CreditCard]] as const;
  return <><SectionTitle eyebrow="Business intelligence" title="Reports" description="Export board-ready reports with granular project, date, agent, type and status filters." action={<button className="button button-primary"><Download size={17} />Export center</button>} /><div className="report-highlight"><div><p>Portfolio overview</p><h2>{money(metrics.totalInventory, true)}</h2><span>Total live inventory value · {metrics.totalUnits} units</span></div><div className="report-highlight-data"><span><b>{metrics.soldUnits}</b> units sold</span><span><b>{metrics.conversionRate}%</b> conversion rate</span><span><b>{money(metrics.totalSales, true)}</b> net sales</span></div><div className="report-spark"><ResponsiveContainer width="100%" height="100%"><AreaChart data={salesChart}><Area type="monotone" dataKey="sales" stroke="#F7E2A2" strokeWidth={2} fill="#F7E2A2" fillOpacity={.2} /></AreaChart></ResponsiveContainer></div></div><div className="report-grid">{reportList.map(([title, description, Icon]) => <button className="report-card" key={title}><span><Icon size={19} /></span><div><h3>{title}</h3><p>{description}</p></div><ChevronRight size={18} /></button>)}</div></>;
}

function OperationsView({ view, setView }: { view: ViewName; setView: (view: ViewName) => void }) {
  const content: Record<string, { eyebrow: string; title: string; description: string; metric1: string; metric2: string; icon: typeof ClipboardList }> = {
    customers: { eyebrow: "Relationship management", title: "Customers", description: "Unified profiles with purchases, reservations, documents and communication history.", metric1: "24 active customers", metric2: "7 documents awaiting review", icon: ContactRound },
    sales: { eyebrow: "Contract management", title: "Sales", description: "Track signed contracts, net values, payment plans and conversion from reservation to sale.", metric1: "EGP 89.4M net sales", metric2: "4 contracts this month", icon: HandCoins },
    reservations: { eyebrow: "Inventory protection", title: "Reservations", description: "Monitor active reservations, expiration dates, booking fees and conversion readiness.", metric1: "14 active reservations", metric2: "3 expire in 48 hours", icon: CalendarClock },
    commissions: { eyebrow: "Agent compensation", title: "Commissions", description: "Approve, schedule and pay agent commissions calculated directly from completed sales.", metric1: "EGP 2.1M due", metric2: "8 pending approvals", icon: HandCoins },
    documents: { eyebrow: "Centralized files", title: "Documents", description: "Securely manage price lists, contracts, brochures, IDs and project documents in one place.", metric1: "128 documents", metric2: "12 uploaded this week", icon: FileText },
    settings: { eyebrow: "Workspace control", title: "Settings", description: "Configure roles, availability workflows, notification rules and organization preferences.", metric1: "6 permission roles", metric2: "9 audit policies active", icon: Settings },
  };
  const data = content[view] || content.customers;
  const Icon = data.icon;
  return <><SectionTitle eyebrow={data.eyebrow} title={data.title} description={data.description} action={<button className="button button-primary"><Plus size={17} />Add {data.title.slice(0, -1)}</button>} /><div className="operations-hero"><div className="operations-icon"><Icon size={25} /></div><div><h2>{data.metric1}</h2><p>{data.metric2}</p></div><button className="button button-subtle" onClick={() => setView(view === "customers" ? "leads" : "availability")}>Open related workspace <ArrowUpRight size={16} /></button></div><section className="panel operations-list"><div className="panel-heading"><div><h2>Recent {data.title.toLowerCase()}</h2><p>Operational records are listed below with live sync and audit tracking.</p></div><button className="text-button">View all <ArrowUpRight size={15} /></button></div>{["Just now", "18 minutes ago", "Yesterday", "Aug 9"].map((time, index) => <div className="operation-row" key={time}><span className="operation-dot" /><div><b>{index === 0 ? `${data.title.slice(0, -1)} record updated` : `${data.title.slice(0, -1)} activity logged`}</b><p>Value 9 Mall · Assigned to Maya El Sherif</p></div><span>{time}</span><button className="row-more"><ChevronRight size={17} /></button></div>)}</section></>;
}
