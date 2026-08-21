import Image from "next/image";
import Header from "@/components/marketing/Header";
import SearchHome from "@/components/marketing/SearchHome";
import ContactForm from "@/components/marketing/ContactForm";

const WHATSAPP = "201001234567";

const SERVICES = [
  {
    icon: "🏷️",
    title: "البيع والتسويق العقاري",
    text: "مصوّرين وحدك احترافياً ونوصلها لآلاف العملاء الجادين في أسرع وقت وبأفضل سعر.",
  },
  {
    icon: "🔑",
    title: "الشراء بالوساطة",
    text: "نلاقيك أفضل وحدة تناسب ميزانيتك واحتياجاتك في المنطقة اللي تحبها.",
  },
  {
    icon: "📜",
    title: "الإيجار الشهري والسنوي",
    text: "شقق ومكاتب ومحلات للإيجار بعقود موثّقة وصيغة قانونية سليمة.",
  },
  {
    icon: "🛠️",
    title: "الإدارة العقارية",
    text: "إدارة وتأجير وتحصيل وإصلاح وحدتك من غير ما تشيل أي هم — إنت في حالك.",
  },
  {
    icon: "📈",
    title: "الاستشارات الاستثمارية",
    text: "نحلّل السوق ونرشّحلك أفضل فرص العائد على الاستثمار بالأرقام.",
  },
  {
    icon: "💳",
    title: "التقسيط والتمويل العقاري",
    text: "نساعدك تاخد وحدتك بالتقسيط مع أفضل شركات التمويل العقاري.",
  },
];

const POINTS = [
  "كل وحدة بتعدي على معاينة وتوثيق كامل للأوراق قبل عرضها",
  "عمولة واضحة ومعلنة من أول يوم — من غير أي مفاجآت",
  "متابعة شخصية من أول معاينة لحد تسليم المفتاح",
  "فريق مبيعات متخصص لكل منطقة عارف كل تفاصيلها",
];

const STATS = [
  { value: "+2,500", label: "وحدة مبيعة" },
  { value: "+40", label: "مشروع ومجتمع سكني" },
  { value: "+1,200", label: "عميل سنوياً" },
  { value: "12", label: "سنة في السوق المصري" },
];

const TESTIMONIALS = [
  {
    name: "محمد عبد العزيز",
    role: "اشترى شقة في التجمع الخامس",
    text: "من أول يوم الفريق كان واضح وصريح معايا. وصلتني الشقة زي ما شفتها بالظبط وخلّصوا كل الأوراق في أسبوعين.",
  },
  {
    name: "سارة حسن",
    role: "باعت فيلا في الشيخ زايد",
    text: "حاولت أبيع الفيلا 6 شهور لوحدي… مع حلو اتباعت في أسبوعين بسعر أعلى من اللي كنت مستنية.",
  },
  {
    name: "كريم فؤاد",
    role: "مستثمر عقاري",
    text: "استشاراتهم الاستثمارية غيّرت نظريتي للسوق. 3 صفقات ناجحة معاهم وعائد ممتاز.",
  },
];

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <SearchHome />

        <section id="services" className="section section-cream">
          <div className="container">
            <div className="section-head">
              <p className="kicker">خدماتنا</p>
              <h2>كل اللي تحتاجه في مكان واحد</h2>
              <p className="section-sub">
                من البحث عن وحدتك لحد إدارتها واستثمارها — حلو معاك في كل خطوة.
              </p>
            </div>
            <div className="services-grid">
              {SERVICES.map((s) => (
                <article key={s.title} className="service-card">
                  <div className="service-icon" aria-hidden="true">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="section section-dark">
          <div className="container about-grid">
            <div>
              <p className="kicker">لماذا حلو؟</p>
              <h2>عشان البيت مش صفقة وبس… دي حياة</h2>
              <p className="about-text">
                إحنا مش بسطاء عقارات، إحنا شريكك في واحدة من أهم قرارات حياتك.
                شغالين في السوق المصري من 2013، وبنؤمن إن الشفافية والصراحة
                هما اللي يبنوا سمعة تدوم.
              </p>
              <ul className="points">
                {POINTS.map((p) => (
                  <li key={p}>
                    <span className="check" aria-hidden="true">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="stats-grid">
              {STATS.map((s) => (
                <div key={s.label} className="stat-card">
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-head">
              <p className="kicker">آراء العملاء</p>
              <h2>ناس حلوة بتقول كلام حلو</h2>
            </div>
            <div className="testimonials-grid">
              {TESTIMONIALS.map((t) => (
                <article key={t.name} className="testimonial-card">
                  <div className="stars" aria-label="تقييم 5 من 5">★★★★★</div>
                  <p className="t-text">“{t.text}”</p>
                  <div className="t-person">
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="cta-band">
          <div className="container cta-inner">
            <div>
              <h2>جاهز تلاقي وحدتك الحلوة؟</h2>
              <p>كلمنا النهارده واحجز معاينة مجانية — من غير أي التزام.</p>
            </div>
            <div className="cta-actions">
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="btn btn-navy">
                واتساب
              </a>
              <a href="tel:+201001234567" className="btn btn-outline-light">
                اتصل: <span dir="ltr">+20 100 123 4567</span>
              </a>
            </div>
          </div>
        </section>

        <section id="contact" className="section section-cream">
          <div className="container">
            <div className="section-head">
              <p className="kicker">تواصل معنا</p>
              <h2>منتظرينك</h2>
              <p className="section-sub">زورنا في المقر أو كلمنا في أي وقت.</p>
            </div>
            <div className="contact-grid">
              <div className="contact-info">
                <div className="info-card">
                  <span className="info-icon" aria-hidden="true">📍</span>
                  <div>
                    <strong>المقر الرئيسي</strong>
                    <p>التجمع الخامس، القاهرة الجديدة، القاهرة</p>
                  </div>
                </div>
                <div className="info-card">
                  <span className="info-icon" aria-hidden="true">📞</span>
                  <div>
                    <strong>تليفون / واتساب</strong>
                    <p dir="ltr">+20 100 123 4567</p>
                  </div>
                </div>
                <div className="info-card">
                  <span className="info-icon" aria-hidden="true">🕒</span>
                  <div>
                    <strong>مواعيد العمل</strong>
                    <p>السبت – الخميس: 10 صباحاً – 8 مساءً</p>
                  </div>
                </div>
                <div className="contact-hero">
                  <Image
                    src="/hero.jpg"
                    alt="مشاريع حلو العقارية"
                    fill
                    sizes="(max-width: 900px) 100vw, 40vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <a href="#home" className="logo logo-light">
              <span className="logo-mark">ح</span>
              <span className="logo-text">
                حلو<i>.</i>
                <small>عقارات</small>
              </span>
            </a>
            <p className="footer-about">
              حلو العقارية — بيع وشراء وإيجار وإدارة واستثمار العقارات في مصر
              بشفافية وصراحة من 2013.
            </p>
          </div>
          <div>
            <h4>روابط سريعة</h4>
            <ul className="footer-links">
              <li><a href="#properties">العقارات</a></li>
              <li><a href="#services">خدماتنا</a></li>
              <li><a href="#about">لماذا حلو؟</a></li>
              <li><a href="#contact">تواصل معنا</a></li>
              <li><a href="/crm">دخول فريق العمل (CRM)</a></li>
            </ul>
          </div>
          <div>
            <h4>تواصل</h4>
            <ul className="footer-links">
              <li dir="ltr">+20 100 123 4567</li>
              <li>التجمع الخامس، القاهرة الجديدة</li>
              <li>السبت – الخميس: 10ص – 8م</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <p>© 2026 حلو العقارية — جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
