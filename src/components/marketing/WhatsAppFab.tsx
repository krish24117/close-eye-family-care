import { MessageCircle } from "lucide-react";
import { whatsappLink, BUSINESS_WHATSAPP_DISPLAY } from "@/lib/whatsapp";

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink("Hi Close Eye, I'd like to know more about your visits.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat on WhatsApp ${BUSINESS_WHATSAPP_DISPLAY}`}
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-medium text-white shadow-elevated hover:brightness-110 transition"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">Chat on WhatsApp</span>
    </a>
  );
}
