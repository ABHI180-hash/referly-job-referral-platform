import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageMeta } from '@/components/common/PageMeta';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { addToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      addToast('Thank you! Your inquiry has been dispatched to our support team.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      <PageMeta
        title="Contact & Support"
        description="Get in touch with Referly customer advocacy and enterprise partnership specialists."
      />
      {/* Page Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-sans font-semibold uppercase tracking-wider text-[#2563EB]">
          Support & Inquiries
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-heading font-bold text-[#090A0F] tracking-tight leading-tight">
          We’re Here to Help You Navigate
        </h1>
        <p className="text-sm sm:text-base font-sans text-slate-600 leading-relaxed">
          Have questions about employee referrals, employer integrations, or enterprise membership? Drop us a note.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card">
          <h2 className="text-lg sm:text-xl font-heading font-semibold text-[#090A0F] mb-6">Send an Inquiry</h2>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-900">Message Received</h3>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Thank you for reaching out. A dedicated member of our customer advocacy team will review your message and reply within 12 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-semibold text-emerald-800 underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Arjun Mehta"
                    className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="arjun.mehta@example.com"
                    className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Question regarding corporate verification"
                  className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist your referral or recruiting process?..."
                  className="w-full text-xs rounded-lg border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm disabled:opacity-60 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Contact Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-card space-y-5">
            <h3 className="text-base font-bold text-slate-900">Direct Contact Information</h3>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 block">General Support</span>
                  <a href="mailto:support@referly.io" className="text-indigo-600 hover:underline">
                    support@referly.io
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 block">Direct Telephone</span>
                  <a href="tel:+918049201940" className="text-indigo-600 hover:underline">
                    +91 (80) 4920-1940
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 block">Headquarters</span>
                  <span className="text-slate-500">
                    Indiranagar 100ft Road, Bengaluru, Karnataka 560038, India
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-900 block">Response Benchmark</span>
                  <span className="text-slate-500">
                    Monday to Friday, 9:00 AM – 7:00 PM IST (Average response under 4 hours)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200/90 p-6 space-y-3 text-xs text-slate-600">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              Corporate Referrer Inquiries
            </h4>
            <p className="leading-relaxed">
              If your engineering team wants to establish an official Referly referral channel for your enterprise, email{' '}
              <a href="mailto:partners@referly.io" className="text-indigo-600 font-semibold hover:underline">
                partners@referly.io
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
