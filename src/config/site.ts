/**
 * Business details for JetPark.
 *
 * Every contact channel is optional. A channel left empty is simply not shown
 * on the site; nothing is rendered in its place. Fill these in before launch.
 */
export const site = {
  name: "JetPark",
  url: "",
  contact: {
    /** International format, digits only, e.g. "972501234567". Shows a call link. */
    phone: "",
    /** Same format as phone. Shows a WhatsApp link that carries the request text. */
    whatsapp: "",
    /** Shows an email link that carries the request text. */
    email: "",
  },
} as const;

export type ContactChannel = "phone" | "whatsapp" | "email";

export function hasAnyContact(): boolean {
  const { phone, whatsapp, email } = site.contact;
  return Boolean(phone || whatsapp || email);
}
