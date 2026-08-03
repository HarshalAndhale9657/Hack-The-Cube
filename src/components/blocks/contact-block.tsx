"use client";

import { useState } from "react";
import { GlassCard } from "@/components/shared/glass-card";
import { siteConfig } from "@/content/site-config";
import { whatsappLink } from "@/lib/utils";
import { Mail, Phone, MessageSquare, AlertTriangle, MapPin, Send, Check } from "lucide-react";

export function ContactBlock() {
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.name && formState.email && formState.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2 max-w-6xl mx-auto items-start">
      {/* Direct Contact Cards */}
      <div className="space-y-6">
        <GlassCard className="p-8 lg:p-10 space-y-6 border-white/10">
          <div className="space-y-3 flex flex-col items-center text-center">
            <span className="text-overline text-orange-500 font-mono">Contact Info</span>
            <h3 className="text-heading-1 text-gray-050 font-display">Get in Touch</h3>
            <p className="text-body text-gray-300 leading-relaxed text-center">
              Have questions about registrations, problem statements, or sponsorship? Reach out directly to our organizing team.
            </p>
          </div>

          <div className="space-y-3.5 border-t border-white/10 pt-6">
            <a
              href={`mailto:${siteConfig.contact.generalEmail}`}
              className="flex items-center gap-3 text-body text-gray-200 hover:text-orange-400 transition-colors p-3 rounded-xl bg-white/5 border border-white/5"
            >
              <Mail size={20} className="text-orange-500 shrink-0" />
              <span className="font-mono">{siteConfig.contact.generalEmail}</span>
            </a>

            {siteConfig.contact.phone.map((p) => (
              <a
                key={p.number}
                href={`tel:${p.number.replace(/\s/g, "")}`}
                className="flex items-center gap-3 text-body text-gray-200 hover:text-orange-400 transition-colors p-3 rounded-xl bg-white/5 border border-white/5"
              >
                <Phone size={20} className="text-orange-500 shrink-0" />
                <span>
                  {p.label}: <strong className="font-mono text-gray-100">{p.number}</strong>
                </span>
              </a>
            ))}

            {siteConfig.contact.whatsapp && (
              <a
                href={whatsappLink(siteConfig.contact.whatsapp, "Hi Hack the Cube team, I have a query:")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-body text-gray-200 hover:text-orange-400 transition-colors p-3 rounded-xl bg-white/5 border border-white/5"
              >
                <MessageSquare size={20} className="text-orange-500 shrink-0" />
                <span>
                  WhatsApp Helpline: <strong className="font-mono text-gray-100">{siteConfig.contact.whatsapp}</strong>
                </span>
              </a>
            )}
          </div>
        </GlassCard>

        {/* Emergency Contacts Card */}
        <GlassCard className="p-8 lg:p-10 border-red-500/30 bg-red-950/20 space-y-5">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-red-400 shrink-0" size={24} />
            <h4 className="text-heading-2 text-gray-050 font-display">Emergency Contacts (Live Event)</h4>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-caption text-gray-300">
            {siteConfig.contact.emergencyContacts.map((c) => (
              <div key={c.label} className="p-3.5 rounded-xl bg-black/40 border border-red-500/20">
                <span className="text-gray-400 block mb-1">{c.label}</span>
                <a href={`tel:${c.number.replace(/\s/g, "")}`} className="font-mono font-bold text-gray-100 hover:text-orange-400 text-sm">
                  {c.number}
                </a>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6 sm:p-8 flex items-start gap-4 border-white/10">
          <MapPin size={22} className="text-orange-500 shrink-0 mt-1" />
          <p className="text-caption text-gray-300 leading-relaxed">{siteConfig.contact.address}</p>
        </GlassCard>
      </div>

      {/* Contact Form */}
      <GlassCard className="p-8 lg:p-10 border-white/10">
        <h3 className="text-heading-1 text-gray-050 mb-8 font-display">Send Us a Message</h3>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-success/20 text-success flex items-center justify-center mx-auto">
              <Check size={32} />
            </div>
            <h4 className="text-heading-2 text-gray-050 font-display">Message Sent!</h4>
            <p className="text-body text-gray-300">Thank you for reaching out. We will respond within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-caption text-gray-300 block mb-1.5 font-medium">Your Name</label>
              <input
                type="text"
                required
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                placeholder="Aarav Sharma"
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-050 placeholder:text-gray-600 focus:border-orange-500 outline-none transition-all text-body"
              />
            </div>
            <div>
              <label className="text-caption text-gray-300 block mb-1.5 font-medium">Email Address</label>
              <input
                type="email"
                required
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                placeholder="aarav@example.com"
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-050 placeholder:text-gray-600 focus:border-orange-500 outline-none transition-all text-body"
              />
            </div>
            <div>
              <label className="text-caption text-gray-300 block mb-1.5 font-medium">Subject</label>
              <input
                type="text"
                required
                value={formState.subject}
                onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                placeholder="Registration Query"
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-050 placeholder:text-gray-600 focus:border-orange-500 outline-none transition-all text-body"
              />
            </div>
            <div>
              <label className="text-caption text-gray-300 block mb-1.5 font-medium">Message</label>
              <textarea
                rows={4}
                required
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                placeholder="Write your message here..."
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-050 placeholder:text-gray-600 focus:border-orange-500 outline-none transition-all text-body"
              />
            </div>

            <button type="submit" className="btn-primary w-full py-4 mt-2 text-base cursor-pointer">
              <Send size={18} /> Send Message
            </button>
          </form>
        )}
      </GlassCard>
    </div>
  );
}
