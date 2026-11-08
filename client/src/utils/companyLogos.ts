export const COMPANY_LOGOS: Record<string, string> = {
  stripe: '/logos/stripe.svg',
  linear: '/logos/linear.svg',
  vercel: '/logos/vercel.svg',
  figma: '/logos/figma.svg',
  razorpay: '/logos/razorpay.svg',
  cred: '/logos/cred.svg',
  atlassian: '/logos/atlassian.svg',
  swiggy: '/logos/swiggy.svg',
  google: '/logos/google.svg',
  microsoft: '/logos/microsoft.svg',
  uber: '/logos/uber.svg',
  coinbase: '/logos/coinbase.svg',
  snowflake: '/logos/snowflake.svg',
  zomato: '/logos/zomato.svg',
  amazon: '/logos/amazon.svg',
  netflix: '/logos/netflix.svg',
  openai: '/logos/openai.svg',
  canva: '/logos/canva.svg',
};

export const getCompanyLogo = (companyName?: string, fallbackUrl?: string): string => {
  if (!companyName) return fallbackUrl || '/logos/default.svg';
  const cleanName = companyName.toLowerCase().trim();

  // Direct match
  if (COMPANY_LOGOS[cleanName]) {
    return COMPANY_LOGOS[cleanName];
  }

  // Substring matching (e.g. "Stripe Inc", "Google Search", "Zomato / Blinkit")
  for (const [key, path] of Object.entries(COMPANY_LOGOS)) {
    if (cleanName.includes(key)) {
      return path;
    }
  }

  // If fallbackUrl is provided and is NOT the generic unsplash placeholder
  if (
    fallbackUrl &&
    !fallbackUrl.includes('photo-1618005182384-a83a8bd57fbe') &&
    fallbackUrl.startsWith('http')
  ) {
    return fallbackUrl;
  }

  return '/logos/default.svg';
};
