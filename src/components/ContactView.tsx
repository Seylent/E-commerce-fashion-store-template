"use client";

import { useBrand } from "@/store/config";

export function ContactView() {
  const brand = useBrand();
  return <div className="info-page section-shell"><div className="page-intro"><span className="eyebrow">GET IN TOUCH</span><h1>Let’s talk.</h1><p>Questions about a piece, an order or something else? We would love to hear from you.</p></div><div className="info-columns"><div><span className="eyebrow">GENERAL INQUIRIES</span><a className="info-large-link" href={`mailto:${brand.contact.email}`}>{brand.contact.email}</a><p>{brand.contact.location}<br />{brand.contact.hours}</p></div><div><span className="eyebrow">A NOTE FOR TEMPLATE OWNERS</span><p>This is a demo contact page. Update the email address in the brand configuration and connect a form service if you need message capture.</p></div></div></div>;
}
