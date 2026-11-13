"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useBrand } from "@/store/config";

export function Newsletter({ id }: { id?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const brand = useBrand();
  return <section id={id} className="newsletter section-shell"><div><h2>{brand.home.newsletterTitle}</h2><p>{brand.home.newsletterCopy}</p></div><form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><label htmlFor="newsletter-email">EMAIL ADDRESS</label><div className="newsletter-input"><input id="newsletter-email" type="email" autoComplete="email" required placeholder="Your email address" /><button aria-label="Join newsletter" type="submit"><ArrowRight size={20} /></button></div><p className="form-note" role="status">{submitted ? "Demo form received. Connect an email platform before launch." : "By subscribing, you agree to receive occasional emails."}</p></form></section>;
}
