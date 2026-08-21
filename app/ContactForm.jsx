"use client";

import { useState } from "react";

const WHATSAPP = "201001234567";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const text = `السلام عليكم، معاك ${name || "عميل جديد"}${
      phone ? ` (موبايل: ${phone})` : ""
    }. ${message || "عايز أستفسر عن العقارات المتاحة."}`;
    window.open(
      `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <h3>ابعتلنا رسالة</h3>
      <label>
        <span>الاسم</span>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="اكتب اسمك"
          required
        />
      </label>
      <label>
        <span>رقم الموبايل</span>
        <input
          type="tel"
          name="phone"
          dir="ltr"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="01xxxxxxxxx"
          required
        />
      </label>
      <label>
        <span>رسالتك</span>
        <textarea
          name="message"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="عايز تستفسر عن إيه؟ (شقة، فيلا، شاليه، استشارة…)"
        ></textarea>
      </label>
      <button type="submit" className="btn btn-gold btn-block">
        ابعت على واتساب
      </button>
      <p className="form-note">بإرسالك الرسالة هيتم تحويلك لواتساب فريق المبيعات.</p>
    </form>
  );
}
