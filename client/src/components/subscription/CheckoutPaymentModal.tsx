import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { PricingPlan } from '@/types';
import { formatCurrencyINR } from '@/utils/cn';
import {
  CreditCard,
  QrCode,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Download,
  Check,
  X,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CheckoutPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: PricingPlan;
  billingInterval: 'monthly' | 'yearly';
  onPaymentSuccess?: (plan: PricingPlan, interval: 'monthly' | 'yearly') => void;
}

export const CheckoutPaymentModal: React.FC<CheckoutPaymentModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  billingInterval,
  onPaymentSuccess,
}) => {
  const { currentUser, updateProfile, addToast } = useApp();
  const navigate = useNavigate();

  // Payment method: 'card' | 'upi' | 'netbanking'
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [upiSubTab, setUpiSubTab] = useState<'id' | 'qr'>('id');

  // Card details
  const [cardNumber, setCardNumber] = useState('4532 8920 1142 8091');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || 'Arjun Mehta');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('784');
  const [saveCard, setSaveCard] = useState(true);

  // UPI details
  const [upiId, setUpiId] = useState(currentUser?.email ? `${currentUser.email.split('@')[0]}@okaxis` : 'arjun@okhdfcbank');
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');

  // Net banking details
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Processing & State
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('Connecting to gateway...');
  const [isSuccess, setIsSuccess] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
      setIsSuccess(false);
      setInvoiceId(`REF-INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`);
      setTransactionId(`txn_live_${Math.random().toString(36).substring(2, 12)}`);
      if (currentUser?.name) {
        setCardHolder(currentUser.name);
      }
    }
  }, [isOpen, currentUser]);

  // Pricing calculations
  const isFree = selectedPlan.id === 'free';
  const unitPrice = billingInterval === 'yearly' ? selectedPlan.yearlyPrice : selectedPlan.monthlyPrice;
  const subtotal = billingInterval === 'yearly' ? unitPrice * 12 : unitPrice;
  const gstAmount = isFree ? 0 : Math.round(subtotal * 0.18);
  const totalAmount = subtotal + gstAmount;

  // Auto-format card number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  // Auto-format expiry
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length > 2) {
      value = `${value.substring(0, 2)}/${value.substring(2)}`;
    }
    setCardExpiry(value);
  };

  // Card brand detection
  const getCardBrand = () => {
    const raw = cardNumber.replace(/\s/g, '');
    if (raw.startsWith('4')) return 'Visa';
    if (raw.startsWith('5')) return 'Mastercard';
    if (raw.startsWith('6')) return 'RuPay';
    if (raw.startsWith('3')) return 'Amex';
    return 'Card';
  };

  const handleProcessPayment = () => {
    // If free plan, instantly complete
    if (isFree) {
      handleFinalizeSuccess();
      return;
    }

    // Basic validation
    if (paymentMethod === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 15) {
        addToast('Please enter a valid 16-digit card number.', 'error');
        return;
      }
      if (!cardExpiry.includes('/') || cardExpiry.length < 5) {
        addToast('Please enter a valid expiry date (MM/YY).', 'error');
        return;
      }
      if (cardCvv.length < 3) {
        addToast('Please enter a valid 3-digit CVV.', 'error');
        return;
      }
    } else if (paymentMethod === 'upi' && upiSubTab === 'id') {
      if (!upiId.includes('@')) {
        addToast('Please enter a valid UPI ID (e.g. name@okhdfcbank).', 'error');
        return;
      }
    }

    // Start payment processing simulation
    setIsProcessing(true);
    setProcessingStage('Connecting to secure payment gateway...');

    setTimeout(() => {
      setProcessingStage(
        paymentMethod === 'card'
          ? `Authenticating 3D-Secure with ${getCardBrand()} Network...`
          : paymentMethod === 'upi'
          ? `Pinging UPI VPA (${upiId})...`
          : `Redirecting to ${selectedBank} netbanking portal...`
      );
    }, 800);

    setTimeout(() => {
      setProcessingStage('Payment verified! Generating invoice & activating tier...');
    }, 1700);

    setTimeout(() => {
      setIsProcessing(false);
      handleFinalizeSuccess();
    }, 2400);
  };

  const handleFinalizeSuccess = () => {
    setIsSuccess(true);
    if (currentUser) {
      updateProfile({
        plan: selectedPlan.id as 'free' | 'pro' | 'enterprise',
        billingInterval,
      });
    }

    if (onPaymentSuccess) {
      onPaymentSuccess(selectedPlan, billingInterval);
    }

    addToast(
      isFree
        ? 'Free Starter membership activated!'
        : `Payment successful! Referly ${selectedPlan.name} is now active.`,
      'success'
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => !isProcessing && onClose()}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-10 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#090A0F] text-white flex items-center justify-center font-mono text-xs font-bold shadow-xs">
              R/
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-heading font-bold text-[#090A0F]">
                  Referly Secure Checkout
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Lock className="w-2.5 h-2.5" /> 256-Bit SSL
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-sans">
                {isFree ? 'Membership Activation' : 'PCI-DSS & RBI Compliant Payment Gateway'}
              </span>
            </div>
          </div>

          {!isProcessing && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        {isSuccess ? (
          /* SUCCESS CONFIRMATION VIEW */
          <div className="p-8 text-center space-y-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md ring-8 ring-emerald-50">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-mono font-semibold text-emerald-600 uppercase tracking-wider">
                Transaction Completed
              </span>
              <h2 className="text-2xl font-heading font-bold text-[#090A0F] tracking-tight">
                {isFree ? 'Free Membership Activated!' : `Welcome to Referly ${selectedPlan.name}!`}
              </h2>
              <p className="text-xs sm:text-sm font-sans text-slate-600 max-w-md mx-auto">
                {isFree
                  ? 'Your candidate profile now has access to community referrals and job tracking.'
                  : `Your ${billingInterval} subscription is confirmed. You now have priority referral requests and verified badge status.`}
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 rounded-xl border border-slate-200/80 p-5 text-left max-w-md mx-auto text-xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Invoice Number</span>
                <span className="font-mono font-semibold text-slate-900">{invoiceId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Plan Activated</span>
                <span className="font-semibold text-slate-900 capitalize">
                  Referly {selectedPlan.name} ({billingInterval})
                </span>
              </div>
              {!isFree && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Amount Paid</span>
                    <span className="font-mono font-bold text-[#090A0F]">
                      {formatCurrencyINR(totalAmount)} (incl. 18% GST)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Payment Channel</span>
                    <span className="font-medium text-slate-800">
                      {paymentMethod === 'card'
                        ? `${getCardBrand()} ending in ${cardNumber.slice(-4)}`
                        : paymentMethod === 'upi'
                        ? `UPI (${selectedUpiApp})`
                        : `Net Banking (${selectedBank})`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Transaction ID</span>
                    <span className="font-mono text-slate-500 text-[11px]">{transactionId}</span>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  navigate('/dashboard');
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#090A0F] hover:bg-slate-800 transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <span>Go to Candidate Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  addToast(`Receipt ${invoiceId} sent to your email and downloaded!`, 'info');
                  onClose();
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Download Invoice</span>
              </button>
            </div>
          </div>
        ) : isProcessing ? (
          /* PROCESSING GATEWAY VIEW */
          <div className="p-12 text-center space-y-6">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-heading font-bold text-slate-900">
                Authorizing Payment...
              </h3>
              <p className="text-xs font-mono text-blue-600 animate-pulse">
                {processingStage}
              </p>
              <p className="text-[11px] text-slate-400">
                Please do not refresh or close this browser window.
              </p>
            </div>
          </div>
        ) : (
          /* MAIN CHECKOUT FORM */
          <div className="p-6 sm:p-7 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Selected Plan Summary Banner */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-heading font-bold text-[#090A0F]">
                    Referly {selectedPlan.name} Plan
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-[#2563EB] border border-blue-200 uppercase">
                    {billingInterval}
                  </span>
                  {billingInterval === 'yearly' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Save 20%
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-md">
                  {selectedPlan.tagline}
                </p>
              </div>

              <div className="text-right sm:text-right">
                <span className="text-2xl font-heading font-bold text-[#090A0F] block">
                  {formatCurrencyINR(subtotal)}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {isFree ? 'Forever free' : `Billed ${billingInterval === 'yearly' ? 'annually' : 'monthly'}`}
                </span>
              </div>
            </div>

            {!isFree ? (
              <>
                {/* Payment Method Selector Tabs */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Select Payment Method:
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        paymentMethod === 'card'
                          ? 'border-blue-600 bg-blue-50/50 text-[#2563EB] shadow-xs ring-2 ring-blue-500/10'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Card / Debit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        paymentMethod === 'upi'
                          ? 'border-blue-600 bg-blue-50/50 text-[#2563EB] shadow-xs ring-2 ring-blue-500/10'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>UPI / QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        paymentMethod === 'netbanking'
                          ? 'border-blue-600 bg-blue-50/50 text-[#2563EB] shadow-xs ring-2 ring-blue-500/10'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Net Banking</span>
                    </button>
                  </div>
                </div>

                {/* TAB 1: CARD PAYMENT */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 p-4 rounded-xl border border-slate-200 bg-slate-50/40">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800">
                        Credit / Debit Card Details
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                        <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-bold text-blue-700">VISA</span>
                        <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-bold text-amber-600">Mastercard</span>
                        <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-bold text-emerald-700">RuPay</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4532 0000 0000 0000"
                          maxLength={19}
                          className="w-full text-xs font-mono rounded-lg border border-slate-200 p-2.5 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-blue-600 font-mono">
                          {getCardBrand()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full text-xs font-mono rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          CVV / Security Code
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full text-xs font-mono rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Name as printed on card"
                        className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                      />
                    </div>

                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>Save card token securely as per RBI guidelines</span>
                    </label>
                  </div>
                )}

                {/* TAB 2: UPI / QR PAYMENT */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-4 p-4 rounded-xl border border-slate-200 bg-slate-50/40">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-semibold text-slate-800">
                        Pay via UPI (Instant & 0% Fee)
                      </span>
                      <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 text-[11px]">
                        <button
                          type="button"
                          onClick={() => setUpiSubTab('id')}
                          className={`px-2.5 py-1 rounded-md transition-all ${
                            upiSubTab === 'id' ? 'bg-[#090A0F] text-white font-semibold' : 'text-slate-600'
                          }`}
                        >
                          UPI ID
                        </button>
                        <button
                          type="button"
                          onClick={() => setUpiSubTab('qr')}
                          className={`px-2.5 py-1 rounded-md transition-all ${
                            upiSubTab === 'qr' ? 'bg-[#090A0F] text-white font-semibold' : 'text-slate-600'
                          }`}
                        >
                          Scan QR Code
                        </button>
                      </div>
                    </div>

                    {upiSubTab === 'id' ? (
                      <div className="space-y-3">
                        <label className="block text-[11px] font-medium text-slate-600">
                          Enter your Virtual Payment Address (UPI ID)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="username@okhdfcbank"
                            className="w-full text-xs font-mono rounded-lg border border-slate-200 p-2.5 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Verified VPA
                          </span>
                        </div>

                        {/* Popular UPI Apps shortcuts */}
                        <div className="pt-2">
                          <span className="text-[11px] text-slate-500 block mb-2">Or select fast app checkout:</span>
                          <div className="grid grid-cols-4 gap-2">
                            {['Google Pay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                              <button
                                key={app}
                                type="button"
                                onClick={() => {
                                  setSelectedUpiApp(app);
                                  const handle = app === 'Google Pay' ? 'okaxis' : app === 'PhonePe' ? 'ybl' : app === 'Paytm' ? 'paytm' : 'upi';
                                  setUpiId(`${cardHolder.toLowerCase().replace(/\s/g, '')}@${handle}`);
                                }}
                                className={`py-2 px-2 rounded-lg border text-xs font-medium text-center transition-all ${
                                  selectedUpiApp === app
                                    ? 'border-blue-600 bg-blue-50 text-[#2563EB] font-semibold'
                                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                {app}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* QR CODE VIEW */
                      <div className="text-center py-4 space-y-3">
                        <div className="w-44 h-44 mx-auto bg-white p-3 rounded-2xl border-2 border-slate-800 shadow-sm flex flex-col items-center justify-center">
                          {/* Simulated SVG QR code */}
                          <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm8-2h2v2h-2v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2zm-6 4h2v2h-2v-2zm4 0h4v2h-4v-2zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2z" />
                          </svg>
                        </div>
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-slate-900 block">
                            Scan with any UPI App to Pay {formatCurrencyINR(totalAmount)}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono block">
                            GPay · PhonePe · Paytm · CRED · Any UPI App
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: NET BANKING */}
                {paymentMethod === 'netbanking' && (
                  <div className="space-y-4 p-4 rounded-xl border border-slate-200 bg-slate-50/40">
                    <span className="text-xs font-semibold text-slate-800 block">
                      Choose Your Bank
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Bank', 'Punjab National Bank'].map((bank) => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => setSelectedBank(bank)}
                          className={`p-2.5 rounded-lg border text-xs text-left transition-all ${
                            selectedBank === bank
                              ? 'border-blue-600 bg-blue-50 text-[#2563EB] font-semibold shadow-2xs'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <Building2 className="w-3.5 h-3.5 mb-1 text-slate-400" />
                          <span className="block truncate">{bank}</span>
                        </button>
                      ))}
                    </div>

                    <div className="pt-2">
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Or select from all other banks:
                      </label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full text-xs rounded-lg border border-slate-200 p-2.5 bg-white text-slate-800"
                      >
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="State Bank of India">State Bank of India</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Bank of Baroda">Bank of Baroda</option>
                        <option value="Canara Bank">Canara Bank</option>
                        <option value="IndusInd Bank">IndusInd Bank</option>
                        <option value="Yes Bank">Yes Bank</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Order Itemized Calculation */}
                <div className="border-t border-slate-200 pt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>
                      Subscription Plan ({billingInterval === 'yearly' ? 'Annual billed as 12 months' : 'Monthly'})
                    </span>
                    <span className="font-mono">{formatCurrencyINR(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>GST (18% itemized SAC: 998314)</span>
                    <span className="font-mono">{formatCurrencyINR(gstAmount)}</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-slate-900 pt-2 border-t border-slate-100 text-sm">
                    <span>Total Amount Payable</span>
                    <span className="font-mono text-base text-[#090A0F]">
                      {formatCurrencyINR(totalAmount)}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              /* FREE PLAN PROMPT */
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-blue-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Free Starter Plan Selected</span>
                </div>
                <p className="text-slate-600">
                  No credit card or online payment required. You'll instantly receive 2 monthly referral requests and full job discovery access.
                </p>
              </div>
            )}

            {/* Submit & Guarantee */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleProcessPayment}
                className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-white bg-[#090A0F] hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2 btn-tactile"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>
                  {isFree
                    ? 'Confirm & Activate Free Plan'
                    : `Pay ${formatCurrencyINR(totalAmount)} Securely`}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 text-center">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 14-day Money Back Guarantee
                </span>
                <span>•</span>
                <span>Cancel Anytime</span>
                <span>•</span>
                <span>Instant Activation</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
