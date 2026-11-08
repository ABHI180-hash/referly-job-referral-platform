import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageMeta } from '@/components/common/PageMeta';
import { mockPricingPlans } from '@/data/mockData';
import { formatCurrencyINR } from '@/utils/cn';
import { CreditCard, CheckCircle2, Sparkles, Check, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import { CheckoutPaymentModal } from '@/components/subscription/CheckoutPaymentModal';
import { PricingPlan } from '@/types';

export const SeekerSubscriptionPage: React.FC = () => {
  const { currentUser, addToast } = useApp();
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedPlanId, setSelectedPlanId] = useState<string>(currentUser?.plan || 'pro');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const currentPlanId = currentUser?.plan || 'pro';
  const selectedPlan: PricingPlan =
    mockPricingPlans.find((p) => p.id === selectedPlanId) || mockPricingPlans[1];

  const handleStartUpgrade = (planId: string) => {
    setSelectedPlanId(planId);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <PageMeta
        title="Subscription & Billing"
        description="Manage your Referly membership tiers, referral limits, and billing details."
      />
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Subscription & Billing</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your Referly membership, referral limits, and payment methods.
        </p>
      </div>

      {/* Current Plan Overview Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3 h-3" /> Active Plan
          </div>
          <h2 className="text-2xl font-extrabold capitalize text-white">
            Referly {currentPlanId} Membership
          </h2>
          <p className="text-xs text-slate-300 max-w-md leading-relaxed">
            You have <strong className="text-white">13 of 15</strong> monthly referral requests remaining in your billing cycle. Auto-renews on August 14, 2027.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => addToast('Official GST Tax Invoice downloaded (PDF).', 'success')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/10 transition-colors"
          >
            Download Invoice
          </button>
          <button
            onClick={() => {
              setSelectedPlanId('enterprise');
              setIsCheckoutOpen(true);
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 transition-colors"
          >
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Plan Selection Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Available Membership Plans</h3>
          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-3 py-1 rounded-md transition-colors ${
                billingInterval === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval('yearly')}
              className={`px-3 py-1 rounded-md transition-colors ${
                billingInterval === 'yearly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Yearly (Save 20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockPricingPlans.map((plan) => {
            const price = billingInterval === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
            const isCurrent = plan.id === currentPlanId;
            const isSelected = plan.id === selectedPlanId;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`bg-white rounded-2xl border p-6 flex flex-col justify-between space-y-5 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-card'
                    : 'border-slate-200/90 shadow-card hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-slate-900">{plan.name}</h4>
                    {isCurrent ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Current Tier
                      </span>
                    ) : isSelected ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        Selected
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 tracking-tight">
                      {formatCurrencyINR(price)}
                    </span>
                    <span className="text-xs font-sans text-slate-500 font-medium">/ month</span>
                  </div>

                  <ul className="mt-4 space-y-2 text-xs text-slate-600">
                    {plan.features.slice(0, 4).map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartUpgrade(plan.id);
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-[#090A0F] hover:bg-slate-800 text-white shadow-xs'
                  }`}
                >
                  <Lock className="w-3 h-3" />
                  <span>{isCurrent ? 'Manage Current Plan' : `Upgrade to ${plan.name}`}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Method UI */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-card space-y-4">
        <h3 className="text-base font-bold text-slate-900">Saved Payment Methods</h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 rounded bg-slate-800 text-white flex items-center justify-center font-bold text-[10px] tracking-widest font-mono">
              VISA
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Visa ending in 4242
              </span>
              <span className="text-[11px] text-slate-400">Expires 08/29 • Primary payment method</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              Pay via UPI / Card
            </button>
          </div>
        </div>
      </div>

      {/* Checkout Payment Modal */}
      <CheckoutPaymentModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedPlan={selectedPlan}
        billingInterval={billingInterval}
        onPaymentSuccess={(plan) => {
          setSelectedPlanId(plan.id);
        }}
      />
    </div>
  );
};
