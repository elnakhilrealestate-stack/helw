"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#home", label: "الرئيسية" },
  { href: "#properties", label: "العقارات" },
  { href: "#services", label: "خدماتنا" },
  { href: "#about", label: "لماذا حلو؟" },
  { href: "#contact", label: "تواصل معنا" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container header-inner">
        <a href="#home" className="logo" onClick={() => setOpen(false)}>
          <span className="logo-mark">ح</span>
          <span className="logo-text">
            حلو<i>.</i>
            <small>عقارات</small>
          </span>
        </a>

        <button
          className={`nav-toggle ${open ? "is-open" : ""}`}
          aria-label="القائمة"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`site-nav ${open ? "is-open" : ""}`}>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="tel:+201001234567" className="btn btn-gold nav-cta">
            اتصل بنا
          </a>
        </nav>
      </div>
    </header>
  );
}
