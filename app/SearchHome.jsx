"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

const WHATSAPP = "201001234567";

export const PROPERTIES = [
  {
    id: 1,
    title: "شقة فاخرة بفيو لاندسكيب",
    location: "التجمع الخامس – القاهرة الجديدة",
    city: "القاهرة الجديدة",
    price: 8500000,
    priceLabel: "8,500,000 ج.م",
    area: 180,
    beds: 3,
    baths: 2,
    type: "شقق",
    image: "/props/apartment.jpg",
    badge: "الأكثر طلباً",
  },
  {
    id: 2,
    title: "فيلا مستقلة بحمام سباحة",
    location: "الشيخ زايد – 6 أكتوبر",
    city: "الشيخ زايد",
    price: 22000000,
    priceLabel: "22,000,000 ج.م",
    area: 350,
    beds: 5,
    baths: 4,
    type: "فلل",
    image: "/props/villa.jpg",
    badge: "فرصة",
  },
  {
    id: 3,
    title: "شاليه فيرست رو بمواجهة البحر",
    location: "سيدي عبد الرحمن – الساحل الشمالي",
    city: "الساحل الشمالي",
    price: 12500000,
    priceLabel: "12,500,000 ج.م",
    area: 140,
    beds: 3,
    baths: 2,
    type: "شاليهات",
    image: "/props/chalet.jpg",
  },
  {
    id: 4,
    title: "بنتهاوس بتراس خاص",
    location: "الشيخ زايد – 6 أكتوبر",
    city: "الشيخ زايد",
    price: 15800000,
    priceLabel: "15,800,000 ج.م",
    area: 200,
    beds: 4,
    baths: 3,
    type: "شقق",
    image: "/props/penthouse.jpg",
    badge: "جديد",
  },
  {
    id: 5,
    title: "مكتب إداري مجهز",
    location: "التجمع الخامس – القاهرة الجديدة",
    city: "القاهرة الجديدة",
    price: 3900000,
    priceLabel: "3,900,000 ج.م",
    area: 90,
    beds: 0,
    baths: 1,
    type: "مكاتب",
    image: "/props/office.jpg",
  },
  {
    id: 6,
    title: "تاون هاوس بحديقة خاصة",
    location: "العبور – القليوبية",
    city: "العبور",
    price: 9800000,
    priceLabel: "9,800,000 ج.م",
    area: 220,
    beds: 4,
    baths: 3,
    type: "فلل",
    image: "/props/townhouse.jpg",
  },
];

const TYPES = ["الكل", "شقق", "فلل", "شاليهات", "مكاتب"];
const CITIES = ["الكل", "القاهرة الجديدة", "الشيخ زايد", "الساحل الشمالي", "العبور"];
const BUDGETS = [
  { value: "0", label: "أي ميزانية" },
  { value: "5000000", label: "حتى 5 مليون" },
  { value: "10000000", label: "حتى 10 مليون" },
  { value: "15000000", label: "حتى 15 مليون" },
  { value: "more", label: "أكثر من 15 مليون" },
];

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-7-7.4-7-12a7 7 0 1 1 14 0c0 4.6-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
function BedIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7" />
      <path d="M3 14h18" />
      <path d="M6 9V6h6v3" />
    </svg>
  );
}
function BathIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3z" />
      <path d="M6 12V6a2 2 0 0 1 2-2h4" />
      <path d="M7 19l-1 2M17 19l1 2" />
    </svg>
  );
}
function AreaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 9V4h5" />
      <path d="M20 15v5h-5" />
      <path d="M4 4l7 7M20 20l-7-7" />
    </svg>
  );
}

export default function SearchHome() {
  const [type, setType] = useState("الكل");
  const [city, setCity] = useState("الكل");
  const [budget, setBudget] = useState("0");

  const filtered = useMemo(() => {
    return PROPERTIES.filter((p) => {
      if (type !== "الكل" && p.type !== type) return false;
      if (city !== "الكل" && p.city !== city) return false;
      if (budget === "more") {
        if (p.price <= 15000000) return false;
      } else if (budget !== "0" && p.price > Number(budget)) return false;
      return true;
    });
  }, [type, city, budget]);

  const onSearch = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setType(String(data.get("type") || "الكل"));
    setCity(String(data.get("city") || "الكل"));
    setBudget(String(data.get("budget") || "0"));
    document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" });
  };

  const reset = () => {
    setType("الكل");
    setCity("الكل");
    setBudget("0");
  };

  return (
    <>
      <section id="home" className="hero">
        <div className="container hero-content">
          <p className="hero-kicker">حلو العقارية — وكل حاجة تبقى حلوة</p>
          <h1>
            لقّي وحدتك <span className="accent">الحلوة</span>
            <br />
            في أحسن الأماكن
          </h1>
          <p className="hero-sub">
            شقق وفلل وشاليهات مختارة بعناية في أرقى مناطق مصر — بيع وشراء وإيجار
            واستشارات استثمارية بضمان فريق حلو.
          </p>

          <form className="search-card" onSubmit={onSearch}>
            <label>
              <span>نوع العقار</span>
              <select name="type" defaultValue={type}>
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t === "الكل" ? "كل الأنواع" : t}</option>
                ))}
              </select>
            </label>
            <label>
              <span>المنطقة</span>
              <select name="city" defaultValue={city}>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c === "الكل" ? "كل المناطق" : c}</option>
                ))}
              </select>
            </label>
            <label>
              <span>الميزانية</span>
              <select name="budget" defaultValue={budget}>
                {BUDGETS.map((b) => (
                  <option key={b.value} value={b.value}>{b.label}</option>
                ))}
              </select>
            </label>
            <button type="submit" className="btn btn-gold">ابحث</button>
          </form>

          <div className="hero-stats">
            <div><strong>+12</strong><span>سنة خبرة</span></div>
            <div><strong>+2,500</strong><span>وحدة مبيعة</span></div>
            <div><strong>+40</strong><span>مشروع</span></div>
            <div><strong>98%</strong><span>عملاء سعداء</span></div>
          </div>
        </div>
      </section>

      <section id="properties" className="section">
        <div className="container">
          <div className="section-head">
            <p className="kicker">معروضاتنا</p>
            <h2>عقارات مختارة لك</h2>
            <p className="section-sub">
              كل وحدة بنعرضها بنعاينها بنفسنا ونتأكد من أوراقها قبل ما توصلك.
            </p>
          </div>

          <div className="filter-bar">
            <div className="pills">
              {TYPES.map((t) => (
                <button
                  key={t}
                  className={`pill ${type === t ? "is-active" : ""}`}
                  onClick={() => setType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
            <select
              className="city-select"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              aria-label="المنطقة"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c === "الكل" ? "كل المناطق" : c}</option>
              ))}
            </select>
          </div>

          <p className="results-count">
            عرض {filtered.length} من {PROPERTIES.length} وحدة
          </p>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <p>مفيش نتائج مطابقة لبحثك — جرّب توسّع الفلاتر.</p>
              <button className="btn btn-navy" onClick={reset}>إعادة ضبط البحث</button>
            </div>
          ) : (
            <div className="props-grid">
              {filtered.map((p) => (
                <article key={p.id} className="prop-card">
                  <div className="prop-media">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                    {p.badge && <span className="prop-badge">{p.badge}</span>}
                    <span className="prop-type">{p.type}</span>
                  </div>
                  <div className="prop-body">
                    <p className="prop-price">{p.priceLabel}</p>
                    <h3>{p.title}</h3>
                    <p className="prop-location">
                      <PinIcon />
                      {p.location}
                    </p>
                    <div className="prop-features">
                      <span><AreaIcon /> {p.area} م²</span>
                      {p.beds > 0 && <span><BedIcon /> {p.beds} غرف</span>}
                      <span><BathIcon /> {p.baths} حمام</span>
                    </div>
                    <a
                      className="btn btn-gold prop-cta"
                      href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
                        `السلام عليكم، مهتم بمعاينة: ${p.title} (${p.location})`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      احجز معاينة
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
