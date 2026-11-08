import React, { useState } from 'react';
import { getCompanyLogo } from '@/utils/companyLogos';

interface CompanyLogoProps {
  company: string;
  logoUrl?: string;
  size?: number;
  className?: string;
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  company,
  logoUrl,
  size = 44,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);
  const resolvedLogo = hasError ? '/logos/default.svg' : getCompanyLogo(company, logoUrl);

  return (
    <div
      className={`relative flex-shrink-0 rounded-lg overflow-hidden bg-white shadow-2xs border border-slate-200/80 p-1 flex items-center justify-center ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        maxWidth: `${size}px`,
        maxHeight: `${size}px`,
      }}
    >
      <img
        src={resolvedLogo}
        alt={`${company} logo`}
        className="w-full h-full object-contain rounded"
        loading="lazy"
        decoding="async"
        onError={() => setHasError(true)}
      />
    </div>
  );
};
