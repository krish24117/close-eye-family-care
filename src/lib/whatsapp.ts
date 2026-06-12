// Public business WhatsApp number (E.164, no '+'). Used for click-to-chat links.
export const BUSINESS_WHATSAPP_NUMBER = "919000221261";
export const BUSINESS_WHATSAPP_DISPLAY = "+91 90002 21261";

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
