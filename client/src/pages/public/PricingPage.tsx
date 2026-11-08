import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { mockPricingPlans } from '@/data/mockData';
import { formatCurrencyINR } from '@/utils/cn';
import {
  Check,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CreditCard,
  Smartphone,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import { PageMeta } from '@/components/common/PageMeta';
import { CheckoutPaymentModal } from '@/components/subscription/CheckoutPaymentModal';
import { PricingPlan } from '@/types';

export const PricingPage: React.FC = () => {
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('pro');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { addToast } = useApp();

  const selectedPlan: PricingPlan =
    mockPricingPlans.find((p) => p.id === selectedPlanId) || mockPricingPlans[1];

  const handlePlanSelectAndProceed = (planId: string) => {
    setSelectedPlanId(planId);
    setIsCheckoutOpen(true);
  };

  const comparisonFeatures = [
    { name: 'Job discovery & search', free: 'Basic', pro: 'Advanced + Salary Bands', enterprise: 'Full API + Export' },
    { name: 'Referral requests per month', free: '2 requests', pro: '15 requests', enterprise: 'Unlimited' },
    { name: 'Application pipeline tracking', free: 'Up to 10 jobs', pro: 'Unlimited', enterprise: 'Unlimited + Telemetry' },
    { name: 'Direct in-app messaging with referrers', free: false, pro: true, enterprise: true },
    { name: 'Priority in employee review queues', free: false, pro: true, enterprise: true },
    { name: 'Verified "Referly Pro" profile badge', free: false, pro: true, enterprise: true },
    { name: 'Dedicated resume & portfolio review', free: false, pro: false, enterprise: true },
    { name: '1-on-1 mock technical interview', free: false, pro: false, enterprise: true },
    { name: 'Support SLA', free: 'Community', pro: 'Priority Email (<12h)', enterprise: 'Dedicated Account Lead' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-14">
      <PageMeta
        title="Simple, Transparent Plans & Online Pricing"
        description="Choose a candidate plan that fits your career goals. Secure card, UPI, and net banking payments."
      />

      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-1 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs font-sans font-medium text-slate-600 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
          <span>Flexible Plans & Online Checkout</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-heading font-bold text-[#090A0F] tracking-tight leading-[1.2]">
          Simple, transparent plans for every career stage.
        </h1>
        <p className="mt-3.5 text-base sm:text-lg font-sans font-normal text-slate-600 leading-relaxed max-w-2xl mx-auto text-pretty">
          Choose any of our 3 plans below. Connect with verified tech insiders, request direct referrals, and fast-track your hiring process.
        </p>

        {/* Billing Interval Toggle & Fast Role Tabs */}
        <div className="pt-4 flex flex-col items-center justify-center gap-4">
          <div className="bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 inline-flex items-center shadow-2xs">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-4 py-2 rounded-lg text-xs font-sans font-medium transition-all ${
                billingInterval === 'monthly'
                  ? 'bg-white text-[#090A0F] font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-[#090A0F]'
              }`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setBillingInterval('yearly')}
              className={`px-4 py-2 rounded-lg text-xs font-sans font-medium transition-all flex items-center gap-2 ${
                billingInterval === 'yearly'
                  ? 'bg-white text-[#090A0F] font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-[#090A0F]'
              }`}
            >
              <span>Annual billing</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-sans font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                Save 20%
              </span>
            </button>
          </div>

          {/* Quick 3-Plan Selection Pill Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Choose Plan:</span>
            {mockPricingPlans.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              const price = billingInterval === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#090A0F] text-white font-semibold shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  <span>{plan.name}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    ({price === 0 ? 'Free' : formatCurrencyINR(price) + '/mo'})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-2">
        {mockPricingPlans.map((plan) => {
          const price = billingInterval === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
          const isSelected = selectedPlanId === plan.id;
          const isPopular = plan.popular;

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`relative rounded-2xl flex flex-col justify-between p-7 sm:p-8 transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-2 border-[#2563EB] ring-4 ring-blue-500/20 shadow-xl bg-gradient-to-b from-blue-50/25 to-white scale-[1.01]'
                  : 'bg-white border border-slate-200/90 shadow-card hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Top Banner Tag */}
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-sans font-semibold bg-[#2563EB] text-white shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Most Popular
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-heading font-bold text-[#090A0F] tracking-tight">
                    {plan.name}
                  </h3>

                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-[#2563EB] border border-blue-200">
                      <Check className="w-3 h-3" /> Selected
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium hover:text-slate-600">
                      Click to select
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm font-sans text-slate-600 leading-relaxed min-h-[40px]">
                  {plan.tagline}
                </p>

                {/* Price block */}
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-heading font-bold text-[#090A0F] tracking-tight">
                    {formatCurrencyINR(price)}
                  </span>
                  <span className="text-sm font-sans text-slate-500 font-medium">
                    {price === 0 ? 'forever' : '/month'}
                  </span>
                </div>
                {billingInterval === 'yearly' && price > 0 && (
                  <span className="text-xs font-sans text-slate-500 mt-1.5 block">
                    Billed annually ({formatCurrencyINR(price * 12)}/year)
                  </span>
                )}

                <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                  <span className="text-xs font-sans font-semibold text-slate-900 block">
                    What's included:
                  </span>
                  <ul className="space-y-3 text-sm font-sans text-slate-600">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlanSelectAndProceed(plan.id);
                  }}
                  className={`w-full py-3 px-4 rounded-xl text-sm font-sans font-semibold transition-all flex items-center justify-center gap-2 btn-tactile ${
                    isSelected
                      ? 'bg-[#090A0F] hover:bg-slate-800 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80'
                  }`}
                >
                  <span>
                    {plan.id === 'free'
                      ? 'Activate Free Starter'
                      : isSelected
                      ? `Proceed to Payment — ${plan.name}`
                      : `Select ${plan.name} Plan`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Plan Sticky Quick-Action Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-heading font-bold text-white">
                Active Selection: Referly {selectedPlan.name} Plan
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-slate-200 uppercase">
                {billingInterval}
              </span>
            </div>
            <span className="text-xs text-slate-300 font-sans block mt-0.5">
              Pay securely via Credit Card, Debit Card, UPI (GPay/PhonePe), or Net Banking.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCheckoutOpen(true)}
          className="px-6 py-2.5 rounded-xl text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-sm inline-flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Lock className="w-3.5 h-3.5 text-slate-700" />
          <span>
            {selectedPlan.id === 'free' ? 'Activate Free Plan' : 'Proceed to Online Payment'}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-700" />
        </button>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="space-y-6 pt-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-[#090A0F] tracking-tight">
            Compare Plan Features & Limits
          </h2>
          <p className="text-sm font-sans text-slate-600">
            A complete overview of limits, features, and platform services available on each plan.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200/90 text-slate-900 font-semibold font-sans text-xs">
              <tr>
                <th className="py-4 px-6">Features & Limits</th>
                <th className="py-4 px-6 text-center">Starter (Free)</th>
                <th className="py-4 px-6 text-center bg-blue-50/40 text-[#2563EB] font-bold">Referly Pro</th>
                <th className="py-4 px-6 text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {comparisonFeatures.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-medium text-slate-900">{row.name}</td>
                  <td className="py-3.5 px-6 text-center">
                    {typeof row.free === 'boolean' ? (
                      row.free ? (
                        <Check className="w-4 h-4 text-[#2563EB] mx-auto" />
                      ) : (
                        <span className="text-slate-300">—</span>
                      )
                    ) : (
                      <span className="text-slate-600 text-xs font-medium">{row.free}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-center bg-blue-50/20 font-semibold text-slate-900">
                    {typeof row.pro === 'boolean' ? (
                      row.pro ? (
                        <Check className="w-4 h-4 text-[#2563EB] mx-auto" />
                      ) : (
                        <span className="text-slate-300">—</span>
                      )
                    ) : (
                      <span className="text-[#2563EB] text-xs font-semibold">{row.pro}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    {typeof row.enterprise === 'boolean' ? (
                      row.enterprise ? (
                        <Check className="w-4 h-4 text-[#2563EB] mx-auto" />
                      ) : (
                        <span className="text-slate-300">—</span>
                      )
                    ) : (
                      <span className="text-slate-700 text-xs font-medium">{row.enterprise}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance / FAQ Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-10 shadow-card space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-heading font-bold text-[#090A0F] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm font-sans text-slate-500 mt-1">
              Common questions about referral policies, subscriptions, and guarantees.
            </p>
          </div>
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-sans text-slate-600">
          <div className="space-y-1.5">
            <h4 className="font-heading font-semibold text-slate-900 text-base">How do payments work on Referly?</h4>
            <p className="leading-relaxed text-pretty">
              We process payments securely in Indian Rupees (INR) using 256-bit encrypted channels. You can pay via Credit/Debit Cards (Visa, MasterCard, RuPay), UPI (Google Pay, PhonePe, Paytm, BHIM), or Net Banking from any Indian bank.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-heading font-semibold text-slate-900 text-base">Do candidates pay employees directly?</h4>
            <p className="leading-relaxed text-pretty">
              Never. Candidates never pay employees for referrals. Corporate referral bonuses are paid entirely by employers under their company referral policies. Referly operates strictly within ethical guidelines and corporate compliance standards.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-heading font-semibold text-slate-900 text-base">Can I cancel or upgrade my subscription anytime?</h4>
            <p className="leading-relaxed text-pretty">
              Yes, you can upgrade, downgrade, or cancel anytime with one click in your account settings. You will maintain access to your plan features until the end of your billing cycle.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-heading font-semibold text-slate-900 text-base">Is there a refund policy?</h4>
            <p className="leading-relaxed text-pretty">
              Yes. All paid subscriptions are backed by our 14-day no-questions-asked money-back guarantee. If you're not satisfied, request a full refund through customer support.
            </p>
          </div>
        </div>
      </div>

      {/* Checkout & Payment Modal */}
      <CheckoutPaymentModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedPlan={selectedPlan}
        billingInterval={billingInterval}
        onPaymentSuccess={(plan, interval) => {
          setSelectedPlanId(plan.id);
        }}
      />
    </div>
  );
};
